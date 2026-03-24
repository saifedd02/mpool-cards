import { getEmployee, getEmployees } from "@/lib/employees";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getEmployees().map((e) => ({ slug: e.slug }));
}

export default function QRPage({ params }: { params: { slug: string } }) {
  const employee = getEmployee(params.slug);
  if (!employee) notFound();

  return (
    <main className="min-h-screen flex items-center justify-center bg-white p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary mb-1">mpool</h1>
        <p className="text-gray-500 mb-6">consulting</p>

        <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/qr/${employee.slug}`}
            alt={`QR Code for ${employee.name}`}
            width={256}
            height={256}
          />
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">{employee.name}</h2>
          <p className="text-gray-500">{employee.role}</p>
        </div>

        <a
          href={`/api/qr/${employee.slug}`}
          download={`qr-${employee.slug}.png`}
          className="inline-block mt-6 bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-accent transition-colors"
        >
          Download QR Code
        </a>

        <p className="text-xs text-gray-400 mt-8">
          Scan to view digital business card
        </p>
      </div>
    </main>
  );
}
