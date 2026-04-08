import Link from "next/link";
import { getEmployees } from "@/lib/employees";

export const dynamic = "force-dynamic";

export default async function Home() {
  const employees = await getEmployees();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-accent">m</span>
            <span className="text-2xl font-bold text-gray-900">pool</span>
            <span className="text-gray-400 text-xs tracking-[0.2em] ml-2">consulting</span>
          </div>
          <Link
            href="/admin"
            className="text-xs text-gray-400 hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full text-primary text-xs font-medium mb-6">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Digitale Visitenkarten
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Unser Team
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Scannen Sie den QR-Code oder wählen Sie einen Kontakt, um die digitale Visitenkarte zu öffnen.
        </p>
      </section>

      {/* Team Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((emp) => (
            <Link
              key={emp.slug}
              href={`/card/${emp.slug}`}
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  {emp.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={emp.photo}
                      alt={emp.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all">
                      {emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                  {/* Online-Punkt */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {emp.name}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">{emp.role}</p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Subtle bottom detail */}
              {emp.email && (
                <p className="text-xs text-gray-400 mt-3 pl-[4.5rem] truncate">
                  {emp.email}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-accent">m</span>
            <span className="text-lg font-bold text-gray-900">pool</span>
            <span className="text-gray-400 text-xs tracking-[0.15em] ml-1.5">consulting</span>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} mpool consulting · Alle Rechte vorbehalten
          </p>
        </div>
      </footer>
    </main>
  );
}
