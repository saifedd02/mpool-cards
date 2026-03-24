import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "./session";

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  rateLimitStore.forEach((entry, key) => {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  });
}

export const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Expires: "0",
  Pragma: "no-cache",
};

function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function requireAdminSession(req: Request): NextResponse | null {
  if (isAdminAuthenticated(req)) {
    return null;
  }

  return NextResponse.json(
    { error: "Nicht autorisiert" },
    { headers: noStoreHeaders, status: 401 }
  );
}

export function enforceRateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowMs: number
): { allowed: true } | { allowed: false; retryAfter: number } {
  cleanupExpiredEntries();
  const now = Date.now();
  const key = `${scope}:${getClientIp(req)}`;
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  rateLimitStore.set(key, { ...current, count: current.count + 1 });
  return { allowed: true };
}
