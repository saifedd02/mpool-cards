import { NextResponse } from "next/server";
import { getEmployees } from "@/lib/employees";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks = {
    status: "ok" as "ok" | "degraded",
    sessionSecretConfigured: Boolean(process.env.SESSION_SECRET),
    blobTokenConfigured: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    timestamp: new Date().toISOString(),
    employeesAvailable: false,
  };

  try {
    const employees = await getEmployees();
    checks.employeesAvailable = employees.length > 0;
  } catch {
    checks.employeesAvailable = false;
  }

  if (!checks.sessionSecretConfigured || !checks.blobTokenConfigured || !checks.employeesAvailable) {
    checks.status = "degraded";
  }

  return NextResponse.json(checks, {
    status: checks.status === "ok" ? 200 : 503,
  });
}
