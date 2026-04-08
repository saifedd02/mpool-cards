import { NextResponse } from "next/server";
import { getPhotoUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

const mediaFilenamePattern = /^[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/i;

export async function GET(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;

  if (!mediaFilenamePattern.test(filename)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Try Vercel Blob first
  const blobUrl = await getPhotoUrl(filename);
  if (blobUrl) {
    return NextResponse.redirect(blobUrl);
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
