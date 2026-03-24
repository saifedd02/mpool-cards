import { NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";
import { noStoreHeaders, requireAdminSession } from "@/lib/security";
import { storagePaths, writeBufferAtomically } from "@/lib/storage";
import { sanitizeLine, slugify } from "@/lib/validation";

export const dynamic = "force-dynamic";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const slug = slugify(sanitizeLine(formData.get("slug"), 80)) || "photo";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Keine Datei empfangen" },
        { headers: noStoreHeaders, status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Nur JPG, PNG und WebP sind erlaubt" },
        { headers: noStoreHeaders, status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Datei ist zu groß (max. 5 MB)" },
        { headers: noStoreHeaders, status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const image = sharp(buffer, { failOn: "error", limitInputPixels: 4096 * 4096 });
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) {
      return NextResponse.json(
        { error: "Ungültige Bilddatei" },
        { headers: noStoreHeaders, status: 400 }
      );
    }

    const optimized = await image
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88 })
      .toBuffer();

    const filename = `${slug}-${Date.now()}.webp`;
    writeBufferAtomically(path.join(storagePaths.uploadsDir, filename), optimized);

    return NextResponse.json(
      { url: `/media/${filename}` },
      { headers: noStoreHeaders }
    );
  } catch {
    return NextResponse.json(
      { error: "Upload fehlgeschlagen" },
      { headers: noStoreHeaders, status: 500 }
    );
  }
}
