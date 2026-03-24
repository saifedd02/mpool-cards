import ContactForm from "../ContactForm";
import SaveToOutlookButton from "../SaveToOutlookButton";

interface Props {
  employee: {
    slug: string; name: string; role: string; phone: string;
    email: string; linkedin: string; website: string; photo: string;
  };
  preview?: boolean;
}

export default function ElegantCard({ employee, preview = false }: Props) {
  const Wrap = preview ? "div" : "main";

  return (
    <Wrap className={`${preview ? "" : "min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 flex items-center justify-center p-4 py-8"}`}>
      <div className={`w-full ${preview ? "w-[400px]" : "max-w-md"}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_40px_-12px_rgba(120,80,0,0.1)] border border-amber-100/60">

          {/* Gold accent top */}
          <div className="h-[3px] bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200" />

          {/* Header */}
          <div className="px-7 pt-9 pb-6 text-center relative">
            {/* Subtle watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <span className="text-[100px] font-serif font-bold text-amber-100/40 select-none leading-none">m</span>
            </div>

            <div className="relative mb-4">
              {employee.photo ? (
                <img src={employee.photo} alt={employee.name} className="w-20 h-20 rounded-full object-cover mx-auto ring-2 ring-amber-200/60 shadow-md" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-200/60 flex items-center justify-center text-primary text-2xl font-serif font-bold mx-auto shadow-md">
                  {employee.name.split(" ").map(n => n[0]).join("")}
                </div>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight font-serif leading-snug">{employee.name}</h1>
            <p className="text-amber-700/80 mt-1 text-[13px] font-medium">{employee.role}</p>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-10 h-px bg-gradient-to-r from-transparent to-amber-300/60" />
              <span className="text-[10px] font-semibold tracking-widest text-amber-600/50 uppercase">mpool consulting</span>
              <div className="w-10 h-px bg-gradient-to-l from-transparent to-amber-300/60" />
            </div>
          </div>

          {/* Contact */}
          <div className="px-7 pb-5 space-y-0.5">
            {employee.phone && (
              <a href={`tel:${employee.phone}`} className="flex items-center gap-3.5 py-3 group">
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-amber-600/50 uppercase tracking-wider">Telefon</p>
                  <p className="text-[13px] text-gray-700">{employee.phone}</p>
                </div>
              </a>
            )}
            <a href={`mailto:${employee.email}`} className="flex items-center gap-3.5 py-3 group">
              <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-amber-600/50 uppercase tracking-wider">E-Mail</p>
                <p className="text-[13px] text-gray-700 break-all">{employee.email}</p>
              </div>
            </a>
            <a href="https://www.mpool-consulting-do.de" target="_blank" className="flex items-center gap-3.5 py-3 group">
              <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-amber-600/50 uppercase tracking-wider">Webseite</p>
                <p className="text-[13px] text-primary font-semibold">www.mpool-consulting-do.de</p>
              </div>
            </a>
            {employee.linkedin && (
              <a href={employee.linkedin} target="_blank" className="flex items-center gap-3.5 py-3 group">
                <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200/50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-amber-600/50 uppercase tracking-wider">LinkedIn</p>
                  <p className="text-[13px] text-gray-700">Profil ansehen</p>
                </div>
              </a>
            )}
          </div>

          {!preview && (
            <>
              {/* Action buttons */}
              <div className="px-7 pb-3 flex gap-2.5">
                <a href={`/api/vcard/${employee.slug}`} download={`${employee.name}.vcf`} className="flex-1 text-center bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold text-[13px] transition-colors shadow-sm">
                  Kontakt speichern
                </a>
                <SaveToOutlookButton slug={employee.slug} name={employee.name} />
              </div>

              {/* Ornamental divider */}
              <div className="flex items-center mx-7 my-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-200/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-300/60 mx-2" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-200/50" />
              </div>

              {/* Contact exchange */}
              <div className="px-7 pb-6">
                <h2 className="text-base font-bold text-gray-900 mb-0.5 font-serif">Kontakt austauschen</h2>
                <p className="text-[11px] text-gray-400 mb-4">Teilen Sie Ihre Daten — wir senden Ihnen die Visitenkarte per E-Mail.</p>
                <ContactForm employeeSlug={employee.slug} employeeName={employee.name} />
              </div>
            </>
          )}

          {/* Footer brand */}
          <div className="bg-amber-50/40 px-5 py-3 flex items-center justify-center gap-1.5 border-t border-amber-100/60">
            <span className="text-[11px] font-serif font-bold text-accent">m</span>
            <span className="text-[11px] font-serif font-bold text-gray-700">pool</span>
            <span className="text-[10px] text-gray-400">consulting</span>
          </div>
        </div>
      </div>
    </Wrap>
  );
}
