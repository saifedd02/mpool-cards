import { PKPass } from "passkit-generator";
import forge from "node-forge";
import { Employee } from "../employees";
import { ICON_1X, ICON_2X, ICON_3X, LOGO_1X, LOGO_2X } from "./assets";

/**
 * Apple Wallet configuration via environment variables (only the company needs
 * these — end users just tap "Add to Apple Wallet" and receive the signed pass).
 *
 *   APPLE_WALLET_TEAM_ID                 Apple Developer Team ID (10 chars)
 *   APPLE_WALLET_PASS_TYPE_IDENTIFIER    e.g. pass.de.mpool-consulting.visitenkarte
 *   APPLE_WALLET_CERTIFICATE_P12_BASE64  exported Pass Type ID .p12 (base64)
 *   APPLE_WALLET_CERTIFICATE_PASSWORD    password of the .p12 export
 * Optional:
 *   APPLE_WALLET_ORGANIZATION_NAME       defaults to "mpool consulting"
 *   APPLE_WALLET_WWDR_PEM_BASE64         Apple WWDR cert (base64 PEM) — only
 *                                        needed if the .p12 does not include it
 */
export function isAppleWalletConfigured(): boolean {
  return Boolean(
    process.env.APPLE_WALLET_TEAM_ID &&
      process.env.APPLE_WALLET_PASS_TYPE_IDENTIFIER &&
      process.env.APPLE_WALLET_CERTIFICATE_P12_BASE64
  );
}

interface SigningCerts {
  signerCert: string;
  signerKey: string;
  wwdr: string;
}

/**
 * Parse the exported .p12 into the PEM strings passkit-generator expects.
 * The .p12 holds the Pass Type ID certificate + its private key; the Apple
 * WWDR intermediate is taken from the .p12 chain when present, otherwise from
 * APPLE_WALLET_WWDR_PEM_BASE64.
 */
function extractCerts(): SigningCerts {
  const p12Base64 = process.env.APPLE_WALLET_CERTIFICATE_P12_BASE64!;
  const password = process.env.APPLE_WALLET_CERTIFICATE_PASSWORD || "";

  const der = forge.util.decode64(p12Base64);
  const asn1 = forge.asn1.fromDer(der);
  const p12 = forge.pkcs12.pkcs12FromAsn1(asn1, password);

  // Private key
  let privateKey: forge.pki.PrivateKey | undefined;
  const keyBags = {
    ...p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag }),
    ...p12.getBags({ bagType: forge.pki.oids.keyBag }),
  };
  for (const bags of Object.values(keyBags)) {
    for (const bag of bags || []) {
      if (bag.key) privateKey = bag.key;
    }
  }
  if (!privateKey) {
    throw new Error("Privater Schlüssel im .p12 nicht gefunden");
  }

  // Certificates: split into the signer (Pass Type ID) cert and the WWDR cert
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })[
    forge.pki.oids.certBag
  ];
  let signerCert: forge.pki.Certificate | undefined;
  let wwdrCert: forge.pki.Certificate | undefined;
  for (const bag of certBags || []) {
    const cert = bag.cert;
    if (!cert) continue;
    const cn =
      cert.subject.getField("CN")?.value ||
      cert.subject.getField("commonName")?.value ||
      "";
    if (/Worldwide Developer Relations/i.test(cn)) {
      wwdrCert = cert;
    } else {
      signerCert = cert;
    }
  }
  if (!signerCert) {
    throw new Error("Signatur-Zertifikat im .p12 nicht gefunden");
  }

  let wwdrPem: string;
  if (wwdrCert) {
    wwdrPem = forge.pki.certificateToPem(wwdrCert);
  } else if (process.env.APPLE_WALLET_WWDR_PEM_BASE64) {
    const raw = process.env.APPLE_WALLET_WWDR_PEM_BASE64;
    wwdrPem = raw.includes("-----BEGIN")
      ? raw
      : Buffer.from(raw, "base64").toString("utf8");
  } else {
    throw new Error(
      "Apple WWDR-Zertifikat fehlt. Exportiere die .p12 mit Zertifikatskette " +
        "oder setze APPLE_WALLET_WWDR_PEM_BASE64."
    );
  }

  return {
    signerCert: forge.pki.certificateToPem(signerCert),
    signerKey: forge.pki.privateKeyToPem(privateKey),
    wwdr: wwdrPem,
  };
}

export async function buildApplePass(
  employee: Employee,
  cardUrl: string
): Promise<Buffer> {
  if (!isAppleWalletConfigured()) {
    throw new Error("Apple Wallet is not configured");
  }

  const orgName =
    process.env.APPLE_WALLET_ORGANIZATION_NAME || "mpool consulting";
  const { signerCert, signerKey, wwdr } = extractCerts();

  const pass = new PKPass(
    {
      "icon.png": Buffer.from(ICON_1X, "base64"),
      "icon@2x.png": Buffer.from(ICON_2X, "base64"),
      "icon@3x.png": Buffer.from(ICON_3X, "base64"),
      "logo.png": Buffer.from(LOGO_1X, "base64"),
      "logo@2x.png": Buffer.from(LOGO_2X, "base64"),
    },
    {
      wwdr: Buffer.from(wwdr),
      signerCert: Buffer.from(signerCert),
      signerKey: Buffer.from(signerKey),
    },
    {
      passTypeIdentifier: process.env.APPLE_WALLET_PASS_TYPE_IDENTIFIER!,
      teamIdentifier: process.env.APPLE_WALLET_TEAM_ID!,
      organizationName: orgName,
      description: `Visitenkarte ${employee.name}`,
      serialNumber: employee.slug,
      backgroundColor: "rgb(0, 48, 135)",
      foregroundColor: "rgb(255, 255, 255)",
      labelColor: "rgb(173, 200, 240)",
      logoText: orgName,
    }
  );

  pass.type = "generic";

  pass.primaryFields.push({ key: "name", label: "NAME", value: employee.name });

  if (employee.role) {
    pass.secondaryFields.push({
      key: "role",
      label: "POSITION",
      value: employee.role,
    });
  }
  if (employee.phone) {
    pass.auxiliaryFields.push({
      key: "phone",
      label: "TELEFON",
      value: employee.phone,
    });
  }

  if (employee.email) {
    pass.backFields.push({ key: "email", label: "E-Mail", value: employee.email });
  }
  if (employee.phone) {
    pass.backFields.push({
      key: "phoneBack",
      label: "Telefon",
      value: employee.phone,
    });
  }
  if (employee.website) {
    pass.backFields.push({
      key: "website",
      label: "Webseite",
      value: employee.website,
    });
  }
  if (employee.linkedin) {
    pass.backFields.push({
      key: "linkedin",
      label: "LinkedIn",
      value: employee.linkedin,
    });
  }
  pass.backFields.push({
    key: "card",
    label: "Digitale Visitenkarte",
    value: cardUrl,
  });

  pass.setBarcodes({
    message: cardUrl,
    format: "PKBarcodeFormatQR",
    messageEncoding: "iso-8859-1",
    altText: employee.name,
  });

  return pass.getAsBuffer();
}
