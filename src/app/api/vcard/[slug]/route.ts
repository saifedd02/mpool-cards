import { NextResponse } from "next/server";
import { getEmployee } from "@/lib/employees";
import { generateVCard } from "@/lib/vcard";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const employee = getEmployee(params.slug);
  if (!employee) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const isOutlook = url.searchParams.get("outlook") === "1";
  const vcard = generateVCard(employee, isOutlook);

  const disposition = isOutlook ? "inline" : "attachment";

  return new NextResponse(vcard, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `${disposition}; filename="${employee.slug}.vcf"`,
    },
  });
}
