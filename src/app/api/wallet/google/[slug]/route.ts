import { NextResponse } from "next/server";
import { getEmployee } from "@/lib/employees";
import {
  buildGoogleWalletSaveUrl,
  isGoogleWalletConfigured,
} from "@/lib/wallet/google";
import { resolveBaseUrl } from "@/lib/wallet/url";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  if (!isGoogleWalletConfigured()) {
    return NextResponse.json(
      { error: "Google Wallet ist nicht konfiguriert" },
      { status: 503 }
    );
  }

  const employee = await getEmployee(params.slug);
  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const baseUrl = resolveBaseUrl(req);
  const cardUrl = `${baseUrl}/card/${employee.slug}`;

  try {
    const saveUrl = buildGoogleWalletSaveUrl(employee, cardUrl, baseUrl);
    // Redirect straight to the Google "Save to Wallet" flow.
    return NextResponse.redirect(saveUrl, { status: 302 });
  } catch (err) {
    console.error("Google Wallet link generation failed:", err);
    return NextResponse.json(
      { error: "Wallet-Link konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}
