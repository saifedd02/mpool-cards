import { NextResponse } from "next/server";
import { getEvents, getEventsByTimeframe } from "@/lib/events";
import { getEmployees } from "@/lib/employees";
import {
  calcStats,
  calcDailyCounts,
  calcEmployeeStats,
  getUniqueVisitors,
  getReturningVisitors,
  getRecentVisitors,
  exportCSV,
} from "@/lib/analytics";
import { noStoreHeaders, requireAdminSession } from "@/lib/security";

export async function GET(req: Request) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) {
    return unauthorized;
  }

  const { searchParams } = new URL(req.url);
  const timeframe = (searchParams.get("timeframe") || "month") as
    | "week"
    | "month"
    | "quarter"
    | "year"
    | "all";
  const format = searchParams.get("format");
  const events = getEventsByTimeframe(timeframe);

  if (format === "csv") {
    const csv = exportCSV(getEvents());
    return new Response(csv, {
      headers: {
        ...noStoreHeaders,
        "Content-Disposition": `attachment; filename="mpool-kontakte-${new Date().toISOString().split("T")[0]}.csv"`,
        "Content-Type": "text/csv; charset=utf-8",
      },
    });
  }

  const employees = getEmployees();
  const employeeNames: Record<string, string> = {};
  for (const employee of employees) {
    employeeNames[employee.slug] = employee.name;
  }

  return NextResponse.json(
    {
      dailyCounts: calcDailyCounts(events, 30),
      employeeStats: calcEmployeeStats(events, employeeNames),
      recentVisitors: getRecentVisitors(events, 20),
      returningVisitors: getReturningVisitors(events),
      stats: calcStats(getEvents()),
      totalEvents: getEvents().length,
      uniqueVisitors: getUniqueVisitors(events),
    },
    { headers: noStoreHeaders }
  );
}
