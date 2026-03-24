import { NextResponse } from "next/server";
import { getEmployees, saveEmployees } from "@/lib/employees";
import { noStoreHeaders, requireAdminSession } from "@/lib/security";
import { validateEmployeeInput } from "@/lib/validation";

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) {
    return unauthorized;
  }

  const body = await req.json().catch(() => null);
  const { data, error } = validateEmployeeInput(body, "update");

  if (error || !data) {
    return NextResponse.json(
      { error: error || "Ungültige Eingabedaten" },
      { headers: noStoreHeaders, status: 400 }
    );
  }

  const employees = getEmployees();
  const index = employees.findIndex((employee) => employee.slug === params.slug);

  if (index === -1) {
    return NextResponse.json(
      { error: "Nicht gefunden" },
      { headers: noStoreHeaders, status: 404 }
    );
  }

  const updatedEmployee = {
    ...employees[index],
    ...data,
  };

  if (updatedEmployee.design !== "custom") {
    delete updatedEmployee.customDesign;
  }

  employees[index] = updatedEmployee;
  saveEmployees(employees);

  return NextResponse.json(updatedEmployee, { headers: noStoreHeaders });
}

export async function DELETE(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const unauthorized = requireAdminSession(req);
  if (unauthorized) {
    return unauthorized;
  }

  const employees = getEmployees();
  const filtered = employees.filter((employee) => employee.slug !== params.slug);

  if (filtered.length === employees.length) {
    return NextResponse.json(
      { error: "Nicht gefunden" },
      { headers: noStoreHeaders, status: 404 }
    );
  }

  saveEmployees(filtered);

  return NextResponse.json(
    { success: true },
    { headers: noStoreHeaders }
  );
}
