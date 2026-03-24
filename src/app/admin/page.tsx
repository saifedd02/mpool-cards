"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Analytics from "./Analytics";
import DesignPicker from "./DesignPicker";
import PhotoUpload from "./PhotoUpload";
import CustomDesignBuilder from "./CustomDesignBuilder";

type CardDesign = "classic" | "minimal" | "dark" | "elegant" | "custom";

interface CustomDesignSettings {
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  cardBg: string;
  textColor: string;
  subtextColor: string;
  headerStyle: "solid" | "gradient" | "none";
  layout: "center" | "left";
  fontStyle: "sans" | "serif";
  borderRadius: "sm" | "md" | "lg";
  iconStyle: "circle" | "square" | "none";
}

interface Employee {
  slug: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
  photo: string;
  design?: CardDesign;
  customDesign?: CustomDesignSettings;
}

const defaultCustomDesign: CustomDesignSettings = {
  primaryColor: "#003087",
  accentColor: "#0057B8",
  bgColor: "#f8fafc",
  cardBg: "#ffffff",
  textColor: "#111827",
  subtextColor: "#6b7280",
  headerStyle: "gradient",
  layout: "center",
  fontStyle: "sans",
  borderRadius: "lg",
  iconStyle: "circle",
};

const emptyEmployee: Omit<Employee, "slug"> = {
  name: "",
  role: "",
  phone: "",
  email: "",
  linkedin: "",
  website: "https://www.mpool-consulting-do.de",
  photo: "",
  design: "classic",
  customDesign: defaultCustomDesign,
};

type Tab = "team" | "analytics" | "settings";

export default function AdminPage() {
  const [authState, setAuthState] = useState<
    "checking" | "authenticated" | "unauthenticated"
  >("checking");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Omit<Employee, "slug">>(emptyEmployee);
  const [formError, setFormError] = useState("");
  const [qrSlug, setQrSlug] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("analytics");
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwStatus, setPwStatus] = useState<"idle" | "success" | "error">("idle");
  const [pwMessage, setPwMessage] = useState("");
  const authenticated = authState === "authenticated";

  const handleUnauthorized = useCallback(() => {
    setAuthState("unauthenticated");
    setEmployees([]);
    setEditing(null);
    setAdding(false);
    setQrSlug(null);
    setPassword("");
    setFormError("");
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Session check failed");
      }

      const data = await res.json();
      setAuthState(data.authenticated ? "authenticated" : "unauthenticated");
    } catch {
      setAuthState("unauthenticated");
    }
  }, []);

  const fetchEmployees = useCallback(async () => {
    const res = await fetch("/api/employees", { cache: "no-store" });
    if (res.status === 401) {
      handleUnauthorized();
      return;
    }

    if (res.ok) {
      setEmployees(await res.json());
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (authenticated) {
      fetchEmployees();
    }
  }, [authenticated, fetchEmployees]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/auth", {
      cache: "no-store",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthState("authenticated");
      setPassword("");
      fetchEmployees();
    } else {
      const data = await res.json().catch(() => ({ error: "Anmeldung fehlgeschlagen" }));
      setAuthState("unauthenticated");
      setAuthError(data.error || "Anmeldung fehlgeschlagen");
    }
  }

  async function handleSave() {
    setFormError("");
    const payload = { ...form };
    if (payload.design !== "custom") {
      delete payload.customDesign;
    }

    if (editing) {
      const res = await fetch(`/api/employees/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Speichern fehlgeschlagen" }));
        setFormError(data.error || "Speichern fehlgeschlagen");
        return;
      }
    } else {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Anlegen fehlgeschlagen" }));
        setFormError(data.error || "Anlegen fehlgeschlagen");
        return;
      }
    }
    setEditing(null);
    setAdding(false);
    setForm(emptyEmployee);
    fetchEmployees();
  }

  async function handleDelete(slug: string) {
    if (!confirm("Diesen Mitarbeiter wirklich löschen?")) return;
    const res = await fetch(`/api/employees/${slug}`, { method: "DELETE" });
    if (res.status === 401) {
      handleUnauthorized();
      return;
    }
    fetchEmployees();
  }

  function startEdit(emp: Employee) {
    setEditing(emp.slug);
    setAdding(false);
    setFormError("");
    setForm({
      name: emp.name,
      role: emp.role,
      phone: emp.phone,
      email: emp.email,
      linkedin: emp.linkedin,
      website: emp.website,
      photo: emp.photo,
      design: emp.design || "classic",
      customDesign: emp.customDesign || defaultCustomDesign,
    });
  }

  function startAdd() {
    setAdding(true);
    setEditing(null);
    setFormError("");
    setForm(emptyEmployee);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwStatus("idle");
    setPwMessage("");

    if (pwNew !== pwConfirm) {
      setPwStatus("error");
      setPwMessage("Neue Passwörter stimmen nicht überein");
      return;
    }

    const res = await fetch("/api/auth", {
      cache: "no-store",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: pwCurrent, newPassword: pwNew }),
    });

    const data = await res.json();

    if (res.ok) {
      setPwStatus("success");
      setPwMessage("Passwort erfolgreich geändert!");
      setPwCurrent("");
      setPwNew("");
      setPwConfirm("");
    } else {
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      setPwStatus("error");
      setPwMessage(data.error || "Fehler beim Ändern");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    handleUnauthorized();
  }

  if (authState === "checking") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Sitzung wird geprüft...</p>
        </div>
      </main>
    );
  }

  // Login screen
  if (!authenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm text-center"
        >
          <div className="mb-2">
            <span className="text-4xl font-bold">
              <span className="text-accent">m</span>
              <span className="text-gray-900">pool</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm tracking-[0.3em] mb-8">consulting</p>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8" />
          <p className="text-gray-500 text-sm font-medium mb-5">Admin Panel</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-center"
          />
          {authError && (
            <p className="text-red-500 text-sm mb-3">{authError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-accent transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Einloggen
          </button>
        </form>
      </main>
    );
  }

  // Admin dashboard
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-xl font-bold">
                <span className="text-accent">m</span>
                <span className="text-gray-900">pool</span>
              </span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="text-sm font-medium text-gray-500">Admin</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Seite ansehen
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeTab === "analytics"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Statistiken
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeTab === "team"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team verwalten
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-5 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeTab === "settings"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Einstellungen
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === "analytics" && <Analytics />}

        {/* Team Tab */}
        {activeTab === "team" && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={startAdd}
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-accent transition-colors"
              >
                + Mitarbeiter hinzufügen
              </button>
            </div>

            {/* Add/Edit Form */}
            {(adding || editing) && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  {editing ? "Mitarbeiter bearbeiten" : "Mitarbeiter hinzufügen"}
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    placeholder="Rolle"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    placeholder="Telefon"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    placeholder="Email *"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    placeholder="LinkedIn URL"
                    value={form.linkedin}
                    onChange={(e) =>
                      setForm({ ...form, linkedin: e.target.value })
                    }
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <input
                    placeholder="Website"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />

                  {/* Photo Upload */}
                  <PhotoUpload
                    photo={form.photo}
                    slug={editing || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "new"}
                    onPhotoChange={(url) => setForm({ ...form, photo: url })}
                  />
                </div>

                {/* Design Picker */}
                <div className="mt-6">
                  <DesignPicker
                    employee={{
                      slug: editing || "preview",
                      name: form.name,
                      role: form.role,
                      phone: form.phone,
                      email: form.email,
                      linkedin: form.linkedin,
                      website: form.website,
                      photo: form.photo,
                    }}
                    selected={(form.design as CardDesign) || "classic"}
                    onSelect={(d) => setForm({ ...form, design: d })}
                    customDesign={form.customDesign}
                  />
                </div>

                {/* Custom Design Builder */}
                {form.design === "custom" && (
                  <CustomDesignBuilder
                    settings={form.customDesign || defaultCustomDesign}
                    onChange={(customDesign) => setForm({ ...form, customDesign })}
                    employee={{
                      slug: editing || "preview",
                      name: form.name,
                      role: form.role,
                      phone: form.phone,
                      email: form.email,
                      linkedin: form.linkedin,
                      website: form.website,
                      photo: form.photo,
                    }}
                  />
                )}

                <div className="flex gap-3 mt-6">
                  {formError && (
                    <div className="w-full text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                      {formError}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-accent transition-colors"
                  >
                    {editing ? "Speichern" : "Hinzufügen"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(null);
                      setAdding(false);
                      setFormError("");
                      setForm(emptyEmployee);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}

            {/* QR Modal */}
            {qrSlug && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
                  <h3 className="text-lg font-semibold mb-4">QR Code</h3>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/qr/${qrSlug}`}
                    alt="QR Code"
                    className="mx-auto w-64 h-64"
                  />
                  <div className="flex gap-3 justify-center mt-6">
                    <a
                      href={`/api/qr/${qrSlug}`}
                      download={`qr-${qrSlug}.png`}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-accent transition-colors"
                    >
                      Download PNG
                    </a>
                    <button
                      onClick={() => setQrSlug(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-100 transition-colors"
                    >
                      Schließen
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Employee List */}
            <div className="space-y-3">
              {employees.map((emp) => (
                <div
                  key={emp.slug}
                  className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                    {emp.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={emp.photo}
                        alt={emp.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      emp.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{emp.name}</h3>
                    <p className="text-sm text-gray-500">{emp.role}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {emp.email}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                    <Link
                      href={`/card/${emp.slug}`}
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Ansehen
                    </Link>
                    <button
                      onClick={() => setQrSlug(emp.slug)}
                      className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      QR
                    </button>
                    <button
                      onClick={() => startEdit(emp)}
                      className="px-3 py-1.5 text-xs bg-accent text-white rounded-lg hover:bg-primary transition-colors"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(emp.slug)}
                      className="px-3 py-1.5 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="max-w-lg">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Passwort ändern</h2>
              <p className="text-sm text-gray-500 mb-6">
                Ändere das Admin-Passwort für den Zugang zum Panel.
              </p>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aktuelles Passwort
                  </label>
                  <input
                    type="password"
                    value={pwCurrent}
                    onChange={(e) => setPwCurrent(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neues Passwort
                  </label>
                  <input
                    type="password"
                    value={pwNew}
                    onChange={(e) => setPwNew(e.target.value)}
                    required
                    minLength={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Neues Passwort bestätigen
                  </label>
                  <input
                    type="password"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    required
                    minLength={4}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {pwStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {pwMessage}
                  </div>
                )}

                {pwStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {pwMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-accent transition-all duration-200 text-sm"
                >
                  Passwort ändern
                </button>
              </form>
            </div>

            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Abmelden</h2>
              <p className="text-sm text-gray-500 mb-4">
                Melde dich aus dem Admin-Panel ab.
              </p>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Ausloggen
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
