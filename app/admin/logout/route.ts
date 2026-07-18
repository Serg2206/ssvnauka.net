import { NextResponse } from "next/server";
import { adminSessionCookieName } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/intake", request.url), { status: 303 });

  response.cookies.set({
    name: adminSessionCookieName,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}