import ContactForm from "../ContactForm";
import SaveToOutlookButton from "../SaveToOutlookButton";

interface Props {
  employee: {
    slug: string; name: string; role: string; phone: string;
    email: string; linkedin: string; website: string; photo: string;
  };
  preview?: boolean;
}

export default function ClassicCard({ employee, preview = false }: Props) {
  const Wrap = preview ? "div" : "main";

  return (
    <Wrap className={`${preview ? "" : "min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4 py-8"}`}>
      <div className={`w-full ${preview ? "w-[400px]" : "max-w-md"}`}>
        <div className="bg-white rounded-2xl shadow-[0_8px_40px_-12px_rgba(0,48,135,0.15)] overflow-hidden">

          {/* Header */}
          <div className="relative bg-primary px-6 pt-10 pb-16 overflow-hidden">
            {/* Subtle geometric pattern */}
            <div className="absolute inset-0 opacity-[0.07]">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full border-[40px] border-white -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full border-[30px] border-white translate-y-1/2 -translate-x-1/3" />
            </div>

            <div className="relative text-center">
              <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full mb-6">
                <span className="text-[11px] font-semibold text-blue-200 tracking-widest uppercase">mpool consulting</span>
              </div>
              <div className="mb-4">
                {employee.photo ? (
                  <img src={employee.photo} alt={employee.name} className="w-[88px] h-[88px] rounded-2xl object-cover mx-auto ring-2 ring-white/20 shadow-lg" />
                ) : (
                  <div className="w-[88px] h-[88px] rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-semibold mx-auto ring-2 ring-white/20 shadow-lg">
                    {employee.name.split(" ").map(n => n[0]).join("")}
                  </div>
                )}
              </div>
              <h1 className="text-[22px] font-bold text-white tracking-tight leading-tight">{employee.name}</h1>
              <p className="text-blue-200 mt-1.5 text-[13px] font-medium">{employee.role}</p>
            </div>
          </div>

          {/* Contact section with overlap */}
          <div className="relative -mt-8 px-5">
            <div className="bg-white rounded-xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] border border-gray-100/80 divide-y divide-gray-100">
              {employee.phone && (
                <a href={`tel:${employee.phone}`} className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-blue-50/50 transition-colors group first:rounded-t-xl">
                  <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:shadow-md transition-all">
                    <svg className="w-[18px] h-[18px] text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Telefon</p>
                    <p className="text-[13px] text-gray-800 font-medium">{employee.phone}</p>
                  </div>
                </a>
              )}
              <a href={`mailto:${employee.email}`} className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-blue-50/50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:shadow-md transition-all">
                  <svg className="w-[18px] h-[18px] text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">E-Mail</p>
                  <p className="text-[13px] text-gray-800 font-medium break-all">{employee.email}</p>
                </div>
              </a>
              <a href="https://www.mpool-consulting-do.de" target="_blank" className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-blue-50/50 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:shadow-md transition-all">
                  <svg className="w-[18px] h-[18px] text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Webseite</p>
                  <p className="text-[13px] text-primary font-semibold">www.mpool-consulting-do.de</p>
                </div>
              </a>
              {employee.linkedin && (
                <a href={employee.linkedin} target="_blank" className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-blue-50/50 transition-colors group last:rounded-b-xl">
                  <div className="w-9 h-9 rounded-lg bg-[#0A66C2]/8 flex items-center justify-center shrink-0 group-hover:bg-[#0A66C2] group-hover:shadow-md transition-all">
                    <svg className="w-[18px] h-[18px] text-[#0A66C2] group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">LinkedIn</p>
                    <p className="text-[13px] text-gray-800 font-medium">Profil ansehen</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {!preview && (
            <>
              {/* Action buttons */}
              <div className="px-5 pt-5 pb-2 flex gap-2.5">
                <a href={`/api/vcard/${employee.slug}`} download={`${employee.name}.vcf`} className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold text-[13px] transition-colors shadow-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                  Kontakt speichern
                </a>
                <SaveToOutlookButton slug={employee.slug} name={employee.name} />
              </div>

              {/* Divider */}
              <div className="mx-5 my-3"><div className="h-px bg-gray-100" /></div>

              {/* Contact exchange */}
              <div className="px-5 pb-6">
                <h2 className="text-base font-bold text-gray-900 mb-0.5">Kontakt austauschen</h2>
                <p className="text-[11px] text-gray-400 mb-4">Teilen Sie Ihre Daten — wir senden Ihnen die Visitenkarte per E-Mail.</p>
                <ContactForm employeeSlug={employee.slug} employeeName={employee.name} />
              </div>
            </>
          )}

          {/* Footer brand */}
          <div className="bg-gray-50/80 px-5 py-3 flex items-center justify-center gap-1.5 border-t border-gray-100">
            <span className="text-[11px] font-bold text-accent">m</span>
            <span className="text-[11px] font-bold text-gray-700">pool</span>
            <span className="text-[10px] text-gray-400">consulting</span>
          </div>
        </div>
      </div>
    </Wrap>
  );
}
