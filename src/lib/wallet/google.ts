import jwt from "jsonwebtoken";
import { Employee } from "../employees";

/**
 * Google Wallet (Android) configuration via environment variables.
 * Requires a (free) Google Wallet issuer account + a service-account key.
 * Only the company needs this — end users just tap "Add to Google Wallet".
 *
 *   GOOGLE_WALLET_ISSUER_ID                    Issuer ID from the Wallet Console
 *   GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64  full service-account JSON (base64)
 * Optional:
 *   GOOGLE_WALLET_CLASS_SUFFIX                 defaults to "business-card"
 */
export function isGoogleWalletConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_WALLET_ISSUER_ID &&
      process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64
  );
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function serviceAccount(): ServiceAccount {
  const raw = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64!;
  const json = raw.trim().startsWith("{")
    ? raw
    : Buffer.from(raw, "base64").toString("utf8");
  const parsed = JSON.parse(json) as ServiceAccount;
  return {
    client_email: parsed.client_email,
    // Allow keys stored with literal "\n" sequences.
    private_key: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

export function buildGoogleWalletSaveUrl(
  employee: Employee,
  cardUrl: string,
  baseUrl: string
): string {
  if (!isGoogleWalletConfigured()) {
    throw new Error("Google Wallet is not configured");
  }

  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const classSuffix = process.env.GOOGLE_WALLET_CLASS_SUFFIX || "business-card";
  const classId = `${issuerId}.${classSuffix}`;
  const objectId = `${issuerId}.${classSuffix}_${employee.slug}`;
  const sa = serviceAccount();

  const textModules: Array<{ id: string; header: string; body: string }> = [];
  if (employee.role)
    textModules.push({ id: "role", header: "Position", body: employee.role });
  if (employee.phone)
    textModules.push({ id: "phone", header: "Telefon", body: employee.phone });
  if (employee.email)
    textModules.push({ id: "email", header: "E-Mail", body: employee.email });

  const links: Array<{ uri: string; description: string }> = [];
  if (employee.website)
    links.push({ uri: employee.website, description: "Webseite" });
  if (employee.linkedin)
    links.push({ uri: employee.linkedin, description: "LinkedIn" });

  const genericObject = {
    id: objectId,
    classId,
    genericType: "GENERIC_TYPE_UNSPECIFIED",
    hexBackgroundColor: "#003087",
    logo: {
      sourceUri: { uri: `${baseUrl}/wallet-logo.png` },
      contentDescription: {
        defaultValue: { language: "de", value: "mpool consulting" },
      },
    },
    cardTitle: { defaultValue: { language: "de", value: "mpool consulting" } },
    header: { defaultValue: { language: "de", value: employee.name } },
    subheader: employee.role
      ? { defaultValue: { language: "de", value: employee.role } }
      : undefined,
    textModulesData: textModules,
    linksModuleData: links.length ? { uris: links } : undefined,
    barcode: { type: "QR_CODE", value: cardUrl, alternateText: employee.name },
  };

  // Embedding the class avoids a separate "create class" API call: Google
  // creates it on first save if it does not exist yet.
  const genericClass = { id: classId };

  const claims = {
    iss: sa.client_email,
    aud: "google",
    typ: "savetowallet",
    origins: [baseUrl],
    payload: {
      genericClasses: [genericClass],
      genericObjects: [genericObject],
    },
  };

  const token = jwt.sign(claims, sa.private_key, { algorithm: "RS256" });
  return `https://pay.google.com/gp/v/save/${token}`;
}
