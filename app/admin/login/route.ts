import { NextResponse } from "next/server";
import { adminSessionCookieName, createAdminSessionValue, isAdminEnabled, isValidAdminToken } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminEnabled()) {
    return NextResponse.redirect(new URL("/admin/intake", request.url), { status: 303 });
  }

  const formData = await request.formData();
  const token = formData.get("token");

  if (typeof token !== "string" || !isValidAdminToken(token)) {
    return NextResponse.redirect(new URL("/admin/intake?error=invalid-token", request.url), { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/admin/intake", request.url), { status: 303 });
  const sessionValue = createAdminSessionValue();

  if (!sessionValue) {
    return response;
  }

  response.cookies.set({
    name: adminSessionCookieName,
    value: sessionValue,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}