import { NextResponse, type NextRequest } from "next/server";

function getCanonicalHost() {
  try {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssvnauka.com";
    return new URL(configuredUrl).host;
  } catch {
    return "ssvnauka.com";
  }
}

function getRequestHost(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedHost) {
    return forwardedHost.split(",")[0].trim();
  }

  return request.headers.get("host") ?? request.nextUrl.host;
}

export function middleware(request: NextRequest) {
  if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview") {
    return NextResponse.next();
  }

  const canonicalHost = getCanonicalHost();
  const requestHost = getRequestHost(request);

  if (!requestHost || requestHost === canonicalHost) {
    return NextResponse.next();
  }

  const targetUrl = request.nextUrl.clone();
  targetUrl.host = canonicalHost;

  return NextResponse.redirect(targetUrl, 308);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"]
};
