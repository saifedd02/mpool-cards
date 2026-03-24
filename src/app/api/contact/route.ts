import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getEmployee } from "@/lib/employees";
import { addEvent } from "@/lib/events";
import { enforceRateLimit, noStoreHeaders } from "@/lib/security";
import {
  escapeHtml,
  isValidSlug,
  normalizeEmail,
  normalizePhone,
  sanitizeLine,
  sanitizeMultiline,
} from "@/lib/validation";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "mpool <onboarding@resend.dev>";

function contactCardHtml(label: string, value: string): string {
  return `<tr><td style="padding: 12px 16px; color: #6b7280; width: 100px; border-bottom: 1px solid #e5e7eb;">${label}</td><td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${value}</td></tr>`;
}

export async function POST(req: Request) {
  const rawBody = await req.json().catch(() => null);
  const body = (rawBody ?? {}) as Record<string, unknown>;

  const employeeSlug = sanitizeLine(body.employeeSlug, 80);
  const visitorName = sanitizeLine(body.visitorName, 80);
  const visitorEmail = normalizeEmail(body.visitorEmail);
  const visitorPhone = normalizePhone(body.visitorPhone);
  const message = sanitizeMultiline(body.message, 800);
  const company = sanitizeLine(body.company, 120);

  if (company) {
    return NextResponse.json({ success: true }, { headers: noStoreHeaders });
  }

  if (!isValidSlug(employeeSlug)) {
    return NextResponse.json(
      { error: "Ungültiger Mitarbeiter" },
      { headers: noStoreHeaders, status: 400 }
    );
  }

  if (visitorName.length < 2 || !visitorEmail || visitorPhone === null) {
    return NextResponse.json(
      { error: "Bitte geben Sie einen gültigen Namen, eine gültige E-Mail und optional eine gültige Telefonnummer an." },
      { headers: noStoreHeaders, status: 400 }
    );
  }

  const rateLimit = enforceRateLimit(req, `contact:${employeeSlug}`, 12, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte später erneut versuchen." },
      {
        headers: {
          ...noStoreHeaders,
          "Retry-After": String(rateLimit.retryAfter),
        },
        status: 429,
      }
    );
  }

  const employee = getEmployee(employeeSlug);
  if (!employee) {
    return NextResponse.json(
      { error: "Mitarbeiter nicht gefunden" },
      { headers: noStoreHeaders, status: 404 }
    );
  }

  const safeVisitorName = escapeHtml(visitorName);
  const safeVisitorEmail = escapeHtml(visitorEmail);
  const safeVisitorPhone = escapeHtml(visitorPhone || "");
  const safeMessage = escapeHtml(message);
  const safeEmployeeName = escapeHtml(employee.name);
  const safeEmployeeRole = escapeHtml(employee.role);
  const safeEmployeePhone = escapeHtml(employee.phone);
  const safeEmployeeEmail = escapeHtml(employee.email);
  const safeEmployeeLinkedin = escapeHtml(employee.linkedin);
  const safeEmployeeWebsite = escapeHtml(employee.website);

  const errors: string[] = [];

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #003087; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">
              <span style="color: #4a9eff;">m</span>pool consulting
            </h1>
          </div>
          <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
            <p style="margin-top: 0;">Hallo ${safeVisitorName},</p>
            <p>vielen Dank für Ihr Interesse. Hier sind die Kontaktdaten von <strong>${safeEmployeeName}</strong>:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px;">
              ${contactCardHtml("Position", safeEmployeeRole)}
              ${employee.phone ? contactCardHtml("Telefon", `<a href="tel:${safeEmployeePhone}" style="color: #003087;">${safeEmployeePhone}</a>`) : ""}
              ${contactCardHtml("E-Mail", `<a href="mailto:${safeEmployeeEmail}" style="color: #003087;">${safeEmployeeEmail}</a>`)}
              ${contactCardHtml("Webseite", `<a href="${safeEmployeeWebsite}" style="color: #003087;">${safeEmployeeWebsite}</a>`)}
              ${employee.linkedin ? `<tr><td style="padding: 12px 16px; color: #6b7280;">LinkedIn</td><td style="padding: 12px 16px;"><a href="${safeEmployeeLinkedin}" style="color: #003087;">Profil ansehen</a></td></tr>` : ""}
            </table>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; text-align: center;">
              mpool Digital Business Cards
            </p>
          </div>
        </div>
      `,
      subject: `Kontaktdaten von ${employee.name} | mpool consulting`,
      to: visitorEmail,
    });
  } catch (error) {
    console.error("Fehler beim Senden an Besucher:", error);
    errors.push("visitor");
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #003087; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">Neuer Kontakt</h1>
            <p style="color: #93c5fd; margin: 4px 0 0; font-size: 14px;">Über Ihre digitale Visitenkarte</p>
          </div>
          <div style="padding: 32px; background: #ffffff; border: 1px solid #e5e7eb;">
            <p style="margin-top: 0;">Hallo ${escapeHtml(employee.name.split(" ")[0] || employee.name)},</p>
            <p>Jemand hat über Ihre digitale Visitenkarte Kontaktdaten ausgetauscht:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8fafc; border-radius: 8px;">
              ${contactCardHtml("Name", `<strong>${safeVisitorName}</strong>`)}
              ${contactCardHtml("E-Mail", `<a href="mailto:${safeVisitorEmail}" style="color: #003087;">${safeVisitorEmail}</a>`)}
              ${visitorPhone ? contactCardHtml("Telefon", `<a href="tel:${safeVisitorPhone}" style="color: #003087;">${safeVisitorPhone}</a>`) : ""}
              ${message ? `<tr><td style="padding: 12px 16px; color: #6b7280;">Nachricht</td><td style="padding: 12px 16px;">${safeMessage.replace(/\n/g, "<br />")}</td></tr>` : ""}
            </table>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; text-align: center;">
              mpool Digital Business Cards
            </p>
          </div>
        </div>
      `,
      subject: `Neuer Kontakt: ${visitorName} über Ihre digitale Visitenkarte`,
      to: employee.email,
    });
  } catch (error) {
    console.error("Fehler beim Senden an Mitarbeiter:", error);
    errors.push("employee");
  }

  addEvent({
    employeeSlug,
    message,
    visitorEmail,
    visitorName,
    visitorPhone: visitorPhone || "",
  });

  if (errors.length === 2) {
    return NextResponse.json(
      { error: "E-Mails konnten nicht gesendet werden." },
      { headers: noStoreHeaders, status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      note: errors.length > 0 ? "Eine der E-Mails konnte nicht zugestellt werden." : undefined,
    },
    { headers: noStoreHeaders }
  );
}
