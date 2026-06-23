import { getEmployee } from "@/lib/employees";
import { notFound } from "next/navigation";
import SaveContactButton from "@/components/SaveContactButton";

export const dynamic = "force-dynamic";

export default async function QRPage({ params }: { params: { slug: string } }) {
  const employee = await getEmployee(params.slug);
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

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`/api/qr/${employee.slug}`}
            download={`qr-${employee.slug}.png`}
            className="inline-flex items-center justify-center bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-accent transition-colors min-w-[220px]"
          >
            QR Code herunterladen
          </a>
          <SaveContactButton
            slug={employee.slug}
            name={employee.name}
            label="Kontakt fuer iPhone & Android"
            loadingLabel="Kontakt wird vorbereitet..."
            className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/5 transition-colors min-w-[220px] disabled:cursor-not-allowed disabled:opacity-80"
          />
        </div>

        <p className="text-xs text-gray-500 mt-3 max-w-md mx-auto">
          Die Kontakt-Datei funktioniert auf iPhone, Apple Kontakte, Android, Google Kontakte
          und in den meisten mobilen Kontakt-Apps.
        </p>

        <p className="text-xs text-gray-400 mt-8">
          Scan to view digital business card
        </p>
      </div>
    </main>
  );
}
