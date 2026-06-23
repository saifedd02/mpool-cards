import { NextResponse } from "next/server";
import { isAppleWalletConfigured } from "@/lib/wallet/apple";
import { isGoogleWalletConfigured } from "@/lib/wallet/google";

export const dynamic = "force-dynamic";

/** Tells the client which wallet buttons to show (no secrets exposed). */
export async function GET() {
  return NextResponse.json(
    {
      apple: isAppleWalletConfigured(),
      google: isGoogleWalletConfigured(),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
