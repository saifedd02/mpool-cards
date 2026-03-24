import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { getSessionSecret } from "./auth";

const ADMIN_SESSION_COOKIE = "mpool_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

interface SessionPayload {
  sub: "admin";
  exp: number;
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

function getCookieValue(req: Request, name: string): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [key, ...rest] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
}

function createSessionToken(): string | null {
  const secret = getSessionSecret();
  if (!secret) {
    return null;
  }

  const payload: SessionPayload = {
    sub: "admin",
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

function verifySessionToken(token: string | null): boolean {
  if (!token) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");
  const secret = getSessionSecret();

  if (!encodedPayload || !signature || !secret) {
    return false;
  }

  const expectedSignature = sign(encodedPayload, secret);
  if (!safeCompare(signature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf-8")
    ) as SessionPayload;

    return payload.sub === "admin" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function isAdminAuthenticated(req: Request): boolean {
  return verifySessionToken(getCookieValue(req, ADMIN_SESSION_COOKIE));
}

export function withAdminSession(response: NextResponse): NextResponse {
  const token = createSessionToken();

  if (token) {
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      token,
      sessionCookieOptions(SESSION_TTL_SECONDS)
    );
  }

  return response;
}

export function clearAdminSession(response: NextResponse): NextResponse {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", sessionCookieOptions(0));
  return response;
}
