import { NextResponse } from "next/server";
import { getEmployee } from "@/lib/employees";
import { buildApplePass, isAppleWalletConfigured } from "@/lib/wallet/apple";
import { resolveBaseUrl } from "@/lib/wallet/url";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  if (!isAppleWalletConfigured()) {
    return NextResponse.json(
      { error: "Apple Wallet ist nicht konfiguriert" },
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
    const buffer = await buildApplePass(employee, cardUrl);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="${employee.slug}.pkpass"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Apple Wallet pass generation failed:", err);
    return NextResponse.json(
      { error: "Wallet-Karte konnte nicht erstellt werden" },
      { status: 500 }
    );
  }
}
