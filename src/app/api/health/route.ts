import { NextResponse } from "next/server";
import { existsSync } from "fs";
import { ensureStorageLayout, storagePaths } from "@/lib/storage";

export const dynamic = "force-dynamic";

export function GET() {
  ensureStorageLayout();

  const checks = {
    status: "ok" as "ok" | "degraded",
    employeesSource:
      existsSync(storagePaths.employees) ? "runtime" : "seed",
    employeesAvailable:
      existsSync(storagePaths.employees) || existsSync(storagePaths.legacyEmployees),
    photosDir: existsSync(storagePaths.uploadsDir),
    sessionSecretConfigured: Boolean(process.env.SESSION_SECRET),
    storageDir: existsSync(storagePaths.root),
    timestamp: new Date().toISOString(),
  };

  if (!checks.storageDir || !checks.employeesAvailable || !checks.sessionSecretConfigured) {
    checks.status = "degraded";
  }

  return NextResponse.json(checks, {
    status: checks.status === "ok" ? 200 : 503,
  });
}
