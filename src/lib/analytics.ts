import { ContactEvent } from "./events";

export interface StatsOverview {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

export interface DailyCount {
  date: string;
  count: number;
}

export interface EmployeeStats {
  slug: string;
  name: string;
  count: number;
}

export interface VisitorEntry {
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  employeeSlug: string;
  timestamp: string;
  message: string;
}

export function calcStats(events: ContactEvent[]): StatsOverview {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setMonth(monthStart.getMonth() - 1);

  return {
    today: events.filter((e) => new Date(e.timestamp) >= todayStart).length,
    thisWeek: events.filter((e) => new Date(e.timestamp) >= weekStart).length,
    thisMonth: events.filter((e) => new Date(e.timestamp) >= monthStart).length,
    total: events.length,
  };
}

export function calcDailyCounts(events: ContactEvent[], days: number): DailyCount[] {
  const result: DailyCount[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const count = events.filter((e) => e.timestamp.startsWith(dateStr)).length;
    result.push({ date: dateStr, count });
  }

  return result;
}

export function calcEmployeeStats(
  events: ContactEvent[],
  employeeNames: Record<string, string>
): EmployeeStats[] {
  const counts: Record<string, number> = {};

  for (const e of events) {
    counts[e.employeeSlug] = (counts[e.employeeSlug] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([slug, count]) => ({
      slug,
      name: employeeNames[slug] || slug,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getUniqueVisitors(events: ContactEvent[]): number {
  const emails = new Set(events.map((e) => e.visitorEmail.toLowerCase()));
  return emails.size;
}

export function getReturningVisitors(events: ContactEvent[]): number {
  const emailCounts: Record<string, number> = {};
  for (const e of events) {
    const email = e.visitorEmail.toLowerCase();
    emailCounts[email] = (emailCounts[email] || 0) + 1;
  }
  return Object.values(emailCounts).filter((c) => c > 1).length;
}

export function getRecentVisitors(events: ContactEvent[], limit: number): VisitorEntry[] {
  return [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
    .map((e) => ({
      visitorName: e.visitorName,
      visitorEmail: e.visitorEmail,
      visitorPhone: e.visitorPhone,
      employeeSlug: e.employeeSlug,
      timestamp: e.timestamp,
      message: e.message,
    }));
}

export function exportCSV(events: ContactEvent[]): string {
  const header = "Datum,Uhrzeit,Mitarbeiter,Besucher Name,Besucher Email,Besucher Telefon,Nachricht";
  const rows = events.map((e) => {
    const d = new Date(e.timestamp);
    const date = d.toLocaleDateString("de-DE");
    const time = d.toLocaleTimeString("de-DE");
    const escape = (s: string) => `"${(s || "").replace(/"/g, '""')}"`;
    return [date, time, escape(e.employeeSlug), escape(e.visitorName), escape(e.visitorEmail), escape(e.visitorPhone), escape(e.message)].join(",");
  });
  return [header, ...rows].join("\n");
}
