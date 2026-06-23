import { NextResponse } from "next/server";
import QRCode from "qrcode";
import sharp from "sharp";
import { getEmployee } from "@/lib/employees";
import { QR_LOGO_PNG_BASE64 } from "./logo";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const employee = await getEmployee(params.slug);
  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const requestUrl = new URL(req.url);
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const forwardedHost =
    req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const baseUrl =
    forwardedProto && forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin;
  const url = `${baseUrl}/card/${employee.slug}`;

  // Generate QR code with high error correction (needed for logo overlay)
  const qrBuffer = await QRCode.toBuffer(url, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: "H", // High correction = 30% can be covered
    color: { dark: "#003087", light: "#FFFFFF" },
  });

  // Resize the pre-rendered logo PNG (font-independent, works on serverless)
  const logoWidth = 120;
  const logoHeight = 48;
  const logoPng = await sharp(Buffer.from(QR_LOGO_PNG_BASE64, "base64"))
    .resize(logoWidth, logoHeight)
    .png()
    .toBuffer();

  // Composite: place logo in the center of the QR code
  const qrWithLogo = await sharp(qrBuffer)
    .composite([
      {
        input: logoPng,
        top: Math.round((512 - logoHeight) / 2),
        left: Math.round((512 - logoWidth) / 2),
      },
    ])
    .png()
    .toBuffer();

  return new NextResponse(new Uint8Array(qrWithLogo), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="qr-${employee.slug}.png"`,
    },
  });
}
