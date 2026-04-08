import { readEmployeesWithDefault, storagePaths, writeJson } from "./storage";

export type CardDesign = "classic" | "minimal" | "dark" | "elegant" | "custom";

export interface CustomDesignSettings {
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

export const defaultCustomDesign: CustomDesignSettings = {
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

export interface Employee {
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

export async function getEmployees(): Promise<Employee[]> {
  return readEmployeesWithDefault<Employee[]>([]);
}

export async function getEmployee(slug: string): Promise<Employee | undefined> {
  const employees = await getEmployees();
  return employees.find((e) => e.slug === slug);
}

export async function saveEmployees(employees: Employee[]): Promise<void> {
  await writeJson(storagePaths.employees, employees);
}
