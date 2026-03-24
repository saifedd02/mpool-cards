import { getEmployee, getEmployees, defaultCustomDesign } from "@/lib/employees";
import { notFound } from "next/navigation";
import ClassicCard from "./designs/ClassicCard";
import MinimalCard from "./designs/MinimalCard";
import DarkCard from "./designs/DarkCard";
import ElegantCard from "./designs/ElegantCard";
import CustomCard from "./designs/CustomCard";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getEmployees().map((e) => ({ slug: e.slug }));
}

export default function CardPage({ params }: { params: { slug: string } }) {
  const employee = getEmployee(params.slug);
  if (!employee) notFound();

  const design = employee.design || "classic";

  switch (design) {
    case "minimal":
      return <MinimalCard employee={employee} />;
    case "dark":
      return <DarkCard employee={employee} />;
    case "elegant":
      return <ElegantCard employee={employee} />;
    case "custom":
      return <CustomCard employee={employee} settings={employee.customDesign || defaultCustomDesign} />;
    default:
      return <ClassicCard employee={employee} />;
  }
}
