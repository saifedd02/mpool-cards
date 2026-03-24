import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";
import { storagePaths } from "@/lib/storage";

export const dynamic = "force-dynamic";

const mediaFilenamePattern = /^[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/i;

function getContentType(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;

  if (!mediaFilenamePattern.test(filename)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = join(storagePaths.uploadsDir, filename);

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const file = readFileSync(filePath);

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": getContentType(filename),
    },
  });
}
