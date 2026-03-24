import { Employee } from "./employees";
import { escapeVCardValue } from "./validation";

export function generateVCard(emp: Employee, outlook = false): string {
  const nameParts = emp.name.split(" ");
  const lastName = nameParts.pop() || "";
  const firstName = nameParts.join(" ");

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)};;;`,
    `FN:${escapeVCardValue(emp.name)}`,
    `ORG:${escapeVCardValue("mpool consulting")}`,
    `TITLE:${escapeVCardValue(emp.role)}`,
    emp.phone ? `TEL;TYPE=WORK,VOICE:${escapeVCardValue(emp.phone)}` : "",
    `EMAIL;TYPE=WORK:${escapeVCardValue(emp.email)}`,
    `URL:${escapeVCardValue(emp.website)}`,
    emp.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${escapeVCardValue(emp.linkedin)}` : "",
    emp.photo ? `PHOTO;VALUE=URI:${escapeVCardValue(emp.photo)}` : "",
  ];

  if (outlook) {
    lines.push(`X-MS-OL-DEFAULT-POSTAL-ADDRESS:2`);
    lines.push(`X-MS-CARDPICTURE;VALUE=URI:${escapeVCardValue(emp.photo || "")}`);
    lines.push(`NOTE:${escapeVCardValue("Kontakt von mpool consulting digitaler Visitenkarte")}`);
  }

  lines.push("END:VCARD");

  return lines.filter(Boolean).join("\r\n");
}
