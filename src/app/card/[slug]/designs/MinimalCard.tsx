import ContactForm from "../ContactForm";
import SaveToOutlookButton from "../SaveToOutlookButton";

interface Props {
  employee: {
    slug: string; name: string; role: string; phone: string;
    email: string; linkedin: string; website: string; photo: string;
  };
  preview?: boolean;
}

export default function MinimalCard({ employee, preview = false }: Props) {
  const Wrap = preview ? "div" : "main";

  return (
    <Wrap className={`${preview ? "" : "min-h-screen bg-[#fafafa] flex items-center justify-center p-4 py-8"}`}>
      <div className={`w-full ${preview ? "w-[400px]" : "max-w-md"}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_1px_20px_-6px_rgba(0,0,0,0.08)] border border-gray-100">

          {/* Header */}
          <div className="px-7 pt-10 pb-7">
            <div className="flex items-start gap-5">
              <div className="shrink-0">
                {employee.photo ? (
                  <img src={employee.photo} alt={employee.name} className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-900 flex items-center justify-center text-white text-xl font-semibold">
                    {employee.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
              </div>
              <div className="pt-0.5 min-w-0">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-snug">{employee.name}</h1>
                <p className="text-gray-500 mt-0.5 text-[13px]">{employee.role}</p>
                <div className="flex items-center gap-1 mt-2.5">
                  <div className="w-5 h-[2px] bg-accent rounded-full" />
                  <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">mpool consulting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-7 h-px bg-gray-100" />

          {/* Contact */}
          <div className="px-7 py-5 space-y-0.5">
            {employee.phone && (
              <a href={`tel:${employee.phone}`} className="flex items-center gap-3 py-2.5 group">
                <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">{employee.phone}</span>
              </a>
            )}
            <a href={`mailto:${employee.email}`} className="flex items-center gap-3 py-2.5 group">
              <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors break-all">{employee.email}</span>
            </a>
            <a href="https://www.mpool-consulting-do.de" target="_blank" className="flex items-center gap-3 py-2.5 group">
              <svg className="w-4 h-4 text-gray-300 group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9"/></svg>
              <span className="text-[13px] text-accent font-medium group-hover:text-primary transition-colors">www.mpool-consulting-do.de</span>
            </a>
            {employee.linkedin && (
              <a href={employee.linkedin} target="_blank" className="flex items-center gap-3 py-2.5 group">
                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#0A66C2] transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <span className="text-[13px] text-gray-600 group-hover:text-gray-900 transition-colors">LinkedIn</span>
              </a>
            )}
          </div>

          {!preview && (
            <>
              {/* Action buttons */}
              <div className="px-7 pb-3 flex gap-2.5">
                <a href={`/api/vcard/${employee.slug}`} download={`${employee.name}.vcf`} className="flex-1 text-center border-2 border-gray-900 text-gray-900 py-2.5 rounded-xl font-semibold text-[13px] hover:bg-gray-900 hover:text-white transition-all">
                  Kontakt speichern
                </a>
                <SaveToOutlookButton slug={employee.slug} name={employee.name} />
              </div>

              {/* Divider */}
              <div className="mx-7 my-3 h-px bg-gray-100" />

              {/* Contact exchange */}
              <div className="px-7 pb-7">
                <h2 className="text-base font-bold text-gray-900 mb-0.5">Kontakt austauschen</h2>
                <p className="text-[11px] text-gray-400 mb-4">Teilen Sie Ihre Daten — wir senden Ihnen die Visitenkarte per E-Mail.</p>
                <ContactForm employeeSlug={employee.slug} employeeName={employee.name} />
              </div>
            </>
          )}
        </div>
      </div>
    </Wrap>
  );
}
