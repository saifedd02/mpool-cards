"use client";

import { useState, useEffect, useCallback } from "react";

interface StatsOverview {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
}

interface DailyCount {
  date: string;
  count: number;
}

interface EmployeeStats {
  slug: string;
  name: string;
  count: number;
}

interface VisitorEntry {
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  employeeSlug: string;
  timestamp: string;
  message: string;
}

interface AnalyticsData {
  stats: StatsOverview;
  dailyCounts: DailyCount[];
  employeeStats: EmployeeStats[];
  uniqueVisitors: number;
  returningVisitors: number;
  recentVisitors: VisitorEntry[];
  totalEvents: number;
}

type Timeframe = "week" | "month" | "quarter" | "year" | "all";

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("month");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/events?timeframe=${timeframe}`, {
      cache: "no-store",
    });
    if (res.ok) {
      setData(await res.json());
    } else if (res.status === 401) {
      setData(null);
    }
    setLoading(false);
  }, [timeframe]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  function handleExportCSV() {
    window.open("/api/events?format=csv", "_blank");
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const maxDaily = Math.max(...data.dailyCounts.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["week", "month", "quarter", "year", "all"] as Timeframe[]).map(
            (tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  timeframe === tf
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tf === "week"
                  ? "7 Tage"
                  : tf === "month"
                    ? "30 Tage"
                    : tf === "quarter"
                      ? "90 Tage"
                      : tf === "year"
                        ? "1 Jahr"
                        : "Alles"}
              </button>
            )
          )}
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSV Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Heute" value={data.stats.today} icon="calendar" color="bg-blue-50 text-blue-700" />
        <StatCard label="Diese Woche" value={data.stats.thisWeek} icon="trending" color="bg-green-50 text-green-700" />
        <StatCard label="Dieser Monat" value={data.stats.thisMonth} icon="chart" color="bg-purple-50 text-purple-700" />
        <StatCard label="Gesamt" value={data.stats.total} icon="users" color="bg-orange-50 text-orange-700" />
      </div>

      {/* Visitors Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Besucher-Insights</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Einzigartige Besucher</span>
              <span className="text-2xl font-bold text-primary">{data.uniqueVisitors}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wiederkehrende Besucher</span>
              <span className="text-2xl font-bold text-accent">{data.returningVisitors}</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Gesamt Kontakt-Austausche</span>
              <span className="text-2xl font-bold text-gray-900">{data.totalEvents}</span>
            </div>
          </div>
        </div>

        {/* Team Overview */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Team-Aktivität</h3>
          {data.employeeStats.length === 0 ? (
            <p className="text-sm text-gray-400 py-4">Noch keine Kontakte</p>
          ) : (
            <div className="space-y-3">
              {data.employeeStats.map((emp) => (
                <div key={emp.slug} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                    {emp.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {emp.name}
                      </span>
                      <span className="text-sm font-bold text-gray-900 ml-2">
                        {emp.count}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                        style={{
                          width: `${(emp.count / Math.max(...data.employeeStats.map((e) => e.count), 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 30-Day Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Kontakte pro Tag — letzte 30 Tage
        </h3>
        <div className="flex items-end gap-1 h-40">
          {data.dailyCounts.map((day) => {
            const height = maxDaily > 0 ? (day.count / maxDaily) * 100 : 0;
            const dateObj = new Date(day.date);
            const isToday =
              day.date === new Date().toISOString().split("T")[0];
            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center justify-end group relative"
              >
                {/* Tooltip */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {dateObj.toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                  : {day.count}
                </div>
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isToday
                      ? "bg-accent"
                      : day.count > 0
                        ? "bg-primary/70 hover:bg-primary"
                        : "bg-gray-100"
                  }`}
                  style={{
                    height: `${Math.max(height, day.count > 0 ? 8 : 2)}%`,
                    minHeight: "2px",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>
            {new Date(data.dailyCounts[0]?.date).toLocaleDateString("de-DE", {
              day: "2-digit",
              month: "2-digit",
            })}
          </span>
          <span>Heute</span>
        </div>
      </div>

      {/* Recent Visitors */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">
          Letzte Kontakt-Austausche
        </h3>
        {data.recentVisitors.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">Noch keine Kontakte</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                    Datum
                  </th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                    Besucher
                  </th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                    Email
                  </th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                    Telefon
                  </th>
                  <th className="text-left py-2 pr-4 text-gray-500 font-medium">
                    Mitarbeiter
                  </th>
                  <th className="text-left py-2 text-gray-500 font-medium">
                    Nachricht
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.recentVisitors.map((v, i) => {
                  const d = new Date(v.timestamp);
                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-2.5 pr-4 text-gray-600 whitespace-nowrap">
                        {d.toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                        })}{" "}
                        <span className="text-gray-400">
                          {d.toLocaleTimeString("de-DE", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 font-medium text-gray-900">
                        {v.visitorName}
                      </td>
                      <td className="py-2.5 pr-4">
                        <a
                          href={`mailto:${v.visitorEmail}`}
                          className="text-accent hover:underline"
                        >
                          {v.visitorEmail}
                        </a>
                      </td>
                      <td className="py-2.5 pr-4 text-gray-600">
                        {v.visitorPhone || "—"}
                      </td>
                      <td className="py-2.5 pr-4 text-gray-600">
                        {v.employeeSlug}
                      </td>
                      <td className="py-2.5 text-gray-500 max-w-[200px] truncate">
                        {v.message || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  const icons: Record<string, JSX.Element> = {
    calendar: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    trending: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    chart: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  };

  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium opacity-80">{label}</span>
        {icons[icon]}
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
