import { NextResponse } from "next/server";
import { isPasswordConfigured, setPassword, verifyPassword } from "@/lib/auth";
import { noStoreHeaders, enforceRateLimit, requireAdminSession } from "@/lib/security";
import { clearAdminSession, isAdminAuthenticated, withAdminSession } from "@/lib/session";
import { sanitizeLine, validatePasswordStrength } from "@/lib/validation";

export async function GET(req: Request) {
  return NextResponse.json(
    { authenticated: await isAdminAuthenticated(req) },
    { headers: noStoreHeaders }
  );
}

export async function POST(req: Request) {
  const rateLimit = enforceRateLimit(req, "admin-login", 10, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Zu viele Login-Versuche. Bitte später erneut versuchen." },
      {
        headers: {
          ...noStoreHeaders,
          "Retry-After": String(rateLimit.retryAfter),
        },
        status: 429,
      }
    );
  }

  if (!(await isPasswordConfigured())) {
    return NextResponse.json(
      { error: "Admin-Passwort ist nicht konfiguriert" },
      { headers: noStoreHeaders, status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  const password = sanitizeLine(body?.password, 128);

  if (!password) {
    return NextResponse.json(
      { error: "Passwort fehlt" },
      { headers: noStoreHeaders, status: 400 }
    );
  }

  if (!(await verifyPassword(password))) {
    return NextResponse.json(
      { error: "Falsches Passwort" },
      { headers: noStoreHeaders, status: 401 }
    );
  }

  return withAdminSession(
    NextResponse.json({ success: true }, { headers: noStoreHeaders })
  );
}

export async function PUT(req: Request) {
  const unauthorized = await requireAdminSession(req);
  if (unauthorized) {
    return unauthorized;
  }

  const body = (await req.json().catch(() => null)) as
    | { currentPassword?: unknown; newPassword?: unknown }
    | null;

  const currentPassword = sanitizeLine(body?.currentPassword, 128);
  const newPassword = sanitizeLine(body?.newPassword, 256);

  if (!(await verifyPassword(currentPassword))) {
    return NextResponse.json(
      { error: "Aktuelles Passwort ist falsch" },
      { headers: noStoreHeaders, status: 400 }
    );
  }

  const passwordError = validatePasswordStrength(newPassword);
  if (passwordError) {
    return NextResponse.json(
      { error: passwordError },
      { headers: noStoreHeaders, status: 400 }
    );
  }

  await setPassword(newPassword);

  return withAdminSession(
    NextResponse.json({ success: true }, { headers: noStoreHeaders })
  );
}

export function DELETE() {
  return clearAdminSession(
    NextResponse.json({ success: true }, { headers: noStoreHeaders })
  );
}
