import { createHash, timingSafeEqual } from "node:crypto";

export const adminSessionCookieName = "ssvnauka_admin_session";

function safeCompare(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function getAdminAccessToken() {
  return process.env.ADMIN_ACCESS_TOKEN?.trim() || null;
}

export function isAdminEnabled() {
  return Boolean(getAdminAccessToken());
}

export function createAdminSessionValue() {
  const token = getAdminAccessToken();

  if (!token) {
    return null;
  }

  return createHash("sha256").update(token).digest("hex");
}

export function isValidAdminToken(token: string) {
  const configuredToken = getAdminAccessToken();

  if (!configuredToken) {
    return false;
  }

  return safeCompare(token, configuredToken);
}

export function isValidAdminSession(sessionValue: string | undefined) {
  const expected = createAdminSessionValue();

  if (!sessionValue || !expected) {
    return false;
  }

  return safeCompare(sessionValue, expected);
}