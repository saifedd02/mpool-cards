import {
  CardDesign,
  CustomDesignSettings,
  Employee,
  defaultCustomDesign,
} from "./employees";

const DEFAULT_WEBSITE = "https://www.mpool-consulting-do.de";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-./\s]{0,40}$/;
const colorPattern = /^#[0-9a-fA-F]{6}$/;
const photoPathPattern = /^\/(?:photos|media)\/[a-z0-9-]+\.(?:jpg|jpeg|png|webp)$/i;

type EmployeeInput = Omit<Employee, "slug"> & { slug?: string };

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function sanitizeLine(value: unknown, maxLength: number): string {
  return asString(value)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function sanitizeMultiline(value: unknown, maxLength: number): string {
  return asString(value)
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isValidSlug(value: string): boolean {
  return slugPattern.test(value);
}

export function normalizeEmail(value: unknown): string | null {
  const email = sanitizeLine(value, 120).toLowerCase();
  return emailPattern.test(email) ? email : null;
}

export function normalizePhone(value: unknown): string | null {
  const phone = sanitizeLine(value, 40);
  return phone === "" || phonePattern.test(phone) ? phone : null;
}

export function normalizeHttpsUrl(
  value: unknown,
  allowedHosts?: string[]
): string | null {
  const raw = sanitizeLine(value, 300);
  if (!raw) {
    return "";
  }

  try {
    const url = new URL(raw);
    if (url.protocol !== "https:") {
      return null;
    }

    if (
      allowedHosts &&
      !allowedHosts.some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`)
      )
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function normalizePhotoUrl(value: unknown): string | null {
  const raw = sanitizeLine(value, 300);
  if (!raw) {
    return "";
  }

  if (raw.startsWith("/")) {
    return photoPathPattern.test(raw) ? raw : null;
  }

  return normalizeHttpsUrl(raw);
}

function normalizeColor(value: unknown, fallback: string): string {
  const color = sanitizeLine(value, 7);
  return colorPattern.test(color) ? color : fallback;
}

export function sanitizeCustomDesign(value: unknown): CustomDesignSettings {
  const input = (value ?? {}) as Partial<CustomDesignSettings>;

  return {
    primaryColor: normalizeColor(input.primaryColor, defaultCustomDesign.primaryColor),
    accentColor: normalizeColor(input.accentColor, defaultCustomDesign.accentColor),
    bgColor: normalizeColor(input.bgColor, defaultCustomDesign.bgColor),
    cardBg: normalizeColor(input.cardBg, defaultCustomDesign.cardBg),
    textColor: normalizeColor(input.textColor, defaultCustomDesign.textColor),
    subtextColor: normalizeColor(input.subtextColor, defaultCustomDesign.subtextColor),
    headerStyle: ["solid", "gradient", "none"].includes(input.headerStyle ?? "")
      ? (input.headerStyle as CustomDesignSettings["headerStyle"])
      : defaultCustomDesign.headerStyle,
    layout: ["center", "left"].includes(input.layout ?? "")
      ? (input.layout as CustomDesignSettings["layout"])
      : defaultCustomDesign.layout,
    fontStyle: ["sans", "serif"].includes(input.fontStyle ?? "")
      ? (input.fontStyle as CustomDesignSettings["fontStyle"])
      : defaultCustomDesign.fontStyle,
    borderRadius: ["sm", "md", "lg"].includes(input.borderRadius ?? "")
      ? (input.borderRadius as CustomDesignSettings["borderRadius"])
      : defaultCustomDesign.borderRadius,
    iconStyle: ["circle", "square", "none"].includes(input.iconStyle ?? "")
      ? (input.iconStyle as CustomDesignSettings["iconStyle"])
      : defaultCustomDesign.iconStyle,
  };
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 12) {
    return "Neues Passwort muss mindestens 12 Zeichen lang sein";
  }

  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Neues Passwort braucht Großbuchstaben, Kleinbuchstaben und Zahlen";
  }

  return null;
}

function validateRequiredName(name: string | undefined): string | null {
  if (name === undefined) {
    return null;
  }

  if (name.length < 2) {
    return "Name ist erforderlich";
  }

  return null;
}

export function validateEmployeeInput(
  body: unknown,
  mode: "create" | "update"
): { data?: Partial<EmployeeInput>; error?: string } {
  if (!body || typeof body !== "object") {
    return { error: "Ungültige Eingabedaten" };
  }

  const input = body as Record<string, unknown>;
  const updates: Partial<EmployeeInput> = {};

  if (mode === "create" || "slug" in input) {
    const slug = sanitizeLine(input.slug, 80);
    if (slug) {
      const normalizedSlug = slugify(slug);
      if (!isValidSlug(normalizedSlug)) {
        return { error: "Ungültiger Slug" };
      }
      updates.slug = normalizedSlug;
    }
  }

  if (mode === "create" || "name" in input) {
    const name = sanitizeLine(input.name, 80);
    const nameError = validateRequiredName(name);
    if (nameError) {
      return { error: nameError };
    }
    updates.name = name;
  }

  if (mode === "create" || "role" in input) {
    updates.role = sanitizeLine(input.role, 120);
  }

  if (mode === "create" || "phone" in input) {
    const phone = normalizePhone(input.phone);
    if (phone === null) {
      return { error: "Telefonnummer ist ungültig" };
    }
    updates.phone = phone;
  }

  if (mode === "create" || "email" in input) {
    const email = normalizeEmail(input.email);
    if (!email) {
      return { error: "E-Mail ist ungültig" };
    }
    updates.email = email;
  }

  if (mode === "create" || "linkedin" in input) {
    const linkedin = normalizeHttpsUrl(input.linkedin, ["linkedin.com"]);
    if (linkedin === null) {
      return { error: "LinkedIn-URL ist ungültig" };
    }
    updates.linkedin = linkedin;
  }

  if (mode === "create" || "website" in input) {
    const website = normalizeHttpsUrl(input.website);
    if (website === null) {
      return { error: "Website-URL ist ungültig" };
    }
    updates.website = website || DEFAULT_WEBSITE;
  }

  if (mode === "create" || "photo" in input) {
    const photo = normalizePhotoUrl(input.photo);
    if (photo === null) {
      return { error: "Foto-URL ist ungültig" };
    }
    updates.photo = photo;
  }

  if (mode === "create" || "design" in input) {
    const design = sanitizeLine(input.design, 20) as CardDesign;
    const allowedDesigns: CardDesign[] = ["classic", "minimal", "dark", "elegant", "custom"];
    updates.design = allowedDesigns.includes(design) ? design : "classic";
  }

  if ((updates.design ?? input.design) === "custom" || "customDesign" in input) {
    updates.customDesign = sanitizeCustomDesign(input.customDesign);
  }

  return { data: updates };
}

export function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r/g, "")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");
}
