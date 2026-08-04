import { NextResponse, type NextRequest } from "next/server";

function getCanonicalHost() {
  try {
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ssvnauka.net";
    return new URL(configuredUrl).host;
  } catch {
    return "ssvnauka.net";
  }
}

const directlyServedHosts = new Set(["ssvnauka.net"]);

function getRequestHost(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");

  if (forwardedHost) {
    return forwardedHost.split(",")[0].trim();
  }

  return request.headers.get("host") ?? request.nextUrl.host;
}

function getLocaleFromPathname(pathname: string) {
  if (pathname === "/ru" || pathname.startsWith("/ru/")) {
    return "ru";
  }

  if (pathname === "/uk" || pathname.startsWith("/uk/")) {
    return "uk";
  }

  return "en";
}

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", getLocaleFromPathname(request.nextUrl.pathname));
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview") {
    return response;
  }

  const canonicalHost = getCanonicalHost();
  const requestHost = getRequestHost(request);

  if (!requestHost || requestHost === canonicalHost || directlyServedHosts.has(requestHost)) {
    return response;
  }

  const targetUrl = request.nextUrl.clone();
  targetUrl.host = canonicalHost;

  return NextResponse.redirect(targetUrl, 308);
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"]
};
