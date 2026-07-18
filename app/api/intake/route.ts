export const runtime = "nodejs";

import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { forwardIntakeToDestination, getIntakeDestinationKind, getIntakeDestinationName } from "@/lib/intake-delivery";

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = Number.parseInt(process.env.INTAKE_RATE_LIMIT_WINDOW_MS ?? "600000", 10);
const RATE_LIMIT_MAX_REQUESTS = Number.parseInt(process.env.INTAKE_RATE_LIMIT_MAX_REQUESTS ?? "5", 10);
const rateLimitStore = globalThis as typeof globalThis & {
  __intakeRateLimitStore__?: Map<string, RateLimitRecord>;
};

const intakeSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  contactValue: z.string().trim().min(5).max(120),
  contactMethod: z.enum(["email", "phone", "telegram"]),
  summary: z.string().trim().min(10).max(1000),
  locale: z.enum(["en", "ru", "uk"]),
  consentData: z.literal("yes"),
  consentPrivacy: z.literal("yes"),
  honeypot: z.string().max(0).optional().or(z.literal(""))
});

function originMatches(request: Request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  return origin === new URL(request.url).origin;
}

function getClientUserAgent(request: Request) {
  return request.headers.get("user-agent");
}

function getClientIpAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [firstAddress] = forwardedFor.split(",");

    if (firstAddress?.trim()) {
      return firstAddress.trim();
    }
  }

  return request.headers.get("x-real-ip") ?? request.headers.get("cf-connecting-ip");
}

function buildRequestFingerprint(request: Request) {
  const ipAddress = getClientIpAddress(request);
  const userAgent = getClientUserAgent(request);

  if (!ipAddress && !userAgent) {
    return null;
  }

  return createHash("sha256")
    .update(`${ipAddress ?? "unknown"}:${userAgent ?? "unknown"}`)
    .digest("hex");
}

function getRateLimitBucket() {
  if (!rateLimitStore.__intakeRateLimitStore__) {
    rateLimitStore.__intakeRateLimitStore__ = new Map<string, RateLimitRecord>();
  }

  return rateLimitStore.__intakeRateLimitStore__;
}

function applyRateLimit(request: Request) {
  if (RATE_LIMIT_MAX_REQUESTS <= 0 || RATE_LIMIT_WINDOW_MS <= 0) {
    return null;
  }

  const fingerprint = buildRequestFingerprint(request);

  if (!fingerprint) {
    return null;
  }

  const now = Date.now();
  const bucket = getRateLimitBucket();

  for (const [key, record] of bucket) {
    if (record.resetAt <= now) {
      bucket.delete(key);
    }
  }

  const current = bucket.get(fingerprint);

  if (!current || current.resetAt <= now) {
    bucket.set(fingerprint, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });

    return {
      limited: false,
      remaining: RATE_LIMIT_MAX_REQUESTS - 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS
    };
  }

  current.count += 1;
  bucket.set(fingerprint, current);

  return {
    limited: current.count > RATE_LIMIT_MAX_REQUESTS,
    remaining: Math.max(RATE_LIMIT_MAX_REQUESTS - current.count, 0),
    resetAt: current.resetAt
  };
}

export async function POST(request: Request) {
  if (!originMatches(request)) {
    return NextResponse.json({ message: "Invalid origin." }, { status: 403 });
  }

  const rateLimit = applyRateLimit(request);

  if (rateLimit?.limited) {
    return NextResponse.json(
      {
        ok: false,
        message: "Too many requests. Please wait before submitting another consultation request."
      },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": Math.max(Math.ceil((rateLimit.resetAt - Date.now()) / 1000), 1).toString()
        }
      }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = intakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please complete all required fields correctly." },
      { status: 400 }
    );
  }

  const requestId = crypto.randomUUID();
  const payload = {
    requestId,
    submittedAt: new Date().toISOString(),
    userAgent: getClientUserAgent(request),
    requestFingerprint: buildRequestFingerprint(request),
    intake: parsed.data
  };

  try {
    const storageResult = await forwardIntakeToDestination(payload);

    return NextResponse.json(
      {
        ok: true,
        requestId,
        stored: storageResult.stored,
        destination: storageResult.destination,
        destinationKind: storageResult.destinationKind,
        message: storageResult.stored
          ? `Request received and forwarded to ${storageResult.destination}.`
          : "Request received. This MVP does not persist medical records unless private storage is configured."
      },
      {
        status: 202,
        headers: {
          "Cache-Control": "no-store",
          ...(rateLimit
            ? {
                "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
                "X-RateLimit-Remaining": rateLimit.remaining.toString(),
                "X-RateLimit-Reset": Math.ceil(rateLimit.resetAt / 1000).toString()
              }
            : {})
        }
      }
    );
  } catch (error) {
    console.error("Intake forwarding failed", error);

    return NextResponse.json(
      {
        ok: false,
        requestId,
        stored: false,
        destination: getIntakeDestinationName(),
        destinationKind: getIntakeDestinationKind(),
        message: `Request was validated, but forwarding to the configured private destination failed.`
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
          ...(rateLimit
            ? {
                "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
                "X-RateLimit-Remaining": rateLimit.remaining.toString(),
                "X-RateLimit-Reset": Math.ceil(rateLimit.resetAt / 1000).toString()
              }
            : {})
        }
      }
    );
  }
}
