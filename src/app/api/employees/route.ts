import { NextResponse } from "next/server";
import { Employee, getEmployees, saveEmployees } from "@/lib/employees";
import { noStoreHeaders, requireAdminSession } from "@/lib/security";
import { slugify, validateEmployeeInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) {
    return unauthorized;
  }

  return NextResponse.json(getEmployees(), { headers: noStoreHeaders });
}

export async function POST(req: Request) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) {
    return unauthorized;
  }

  const body = await req.json().catch(() => null);
  const { data, error } = validateEmployeeInput(body, "create");

  if (error || !data?.name || !data.email) {
    return NextResponse.json(
      { error: error || "Name und E-Mail sind erforderlich" },
      { headers: noStoreHeaders, status: 400 }
    );
  }

  const employees = getEmployees();
  const slug = data.slug || slugify(data.name);

  if (!slug) {
    return NextResponse.json(
      { error: "Slug konnte nicht erzeugt werden" },
      { headers: noStoreHeaders, status: 400 }
    );
  }

  if (employees.some((employee) => employee.slug === slug)) {
    return NextResponse.json(
      { error: "Mitarbeiter mit diesem Slug existiert bereits" },
      { headers: noStoreHeaders, status: 409 }
    );
  }

  const newEmployee: Employee = {
    slug,
    name: data.name,
    role: data.role || "",
    phone: data.phone || "",
    email: data.email,
    linkedin: data.linkedin || "",
    website: data.website || "https://www.mpool-consulting-do.de",
    photo: data.photo || "",
    design: data.design || "classic",
    ...(data.design === "custom" && data.customDesign
      ? { customDesign: data.customDesign }
      : {}),
  };

  employees.push(newEmployee);
  saveEmployees(employees);

  return NextResponse.json(newEmployee, {
    headers: noStoreHeaders,
    status: 201,
  });
}
