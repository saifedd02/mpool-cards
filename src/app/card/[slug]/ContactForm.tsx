"use client";

import { useState } from "react";

export default function ContactForm({
  employeeSlug,
  employeeName,
}: {
  employeeSlug: string;
  employeeName: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      employeeSlug,
      visitorName: (form.elements.namedItem("visitorName") as HTMLInputElement).value,
      visitorEmail: (form.elements.namedItem("visitorEmail") as HTMLInputElement).value,
      visitorPhone: (form.elements.namedItem("visitorPhone") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      company: (form.elements.namedItem("company") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Senden fehlgeschlagen");
      }

      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Etwas ist schief gelaufen");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-green-700 font-semibold mb-1">Gesendet!</p>
        <p className="text-sm text-gray-500">
          Die Kontaktdaten von {employeeName} wurden an Ihre E-Mail gesendet.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-accent hover:underline font-medium"
        >
          Erneut senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
      />
      <input
        name="visitorName"
        type="text"
        required
        placeholder="Ihr Name *"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
      />
      <input
        name="visitorEmail"
        type="email"
        required
        placeholder="Ihre E-Mail *"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
      />
      <input
        name="visitorPhone"
        type="tel"
        placeholder="Ihre Telefonnummer (optional)"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
      />
      <textarea
        name="message"
        rows={3}
        placeholder="Nachricht (optional)"
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-colors"
      />

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-2 rounded-lg text-sm">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-accent text-white py-3 rounded-xl font-semibold hover:bg-primary transition-all duration-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Wird gesendet...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Absenden & Kontaktdaten erhalten
          </>
        )}
      </button>
    </form>
  );
}
