import ContactForm from "../ContactForm";
import SaveToOutlookButton from "../SaveToOutlookButton";

interface Props {
  employee: {
    slug: string; name: string; role: string; phone: string;
    email: string; linkedin: string; website: string; photo: string;
  };
  preview?: boolean;
}

export default function DarkCard({ employee, preview = false }: Props) {
  const Wrap = preview ? "div" : "main";

  return (
    <Wrap className={`${preview ? "" : "min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 py-8"}`}>
      <div className={`w-full ${preview ? "w-[400px]" : "max-w-md"}`}>
        <div className="bg-[#111118] rounded-2xl overflow-hidden shadow-[0_8px_40px_-12px_rgba(0,87,184,0.2)] border border-white/[0.06] relative">

          {/* Ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-48 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="relative px-7 pt-10 pb-7 text-center">
            <div className="mb-5">
              {employee.photo ? (
                <img src={employee.photo} alt={employee.name} className="w-20 h-20 rounded-2xl object-cover mx-auto ring-1 ring-white/10 shadow-lg" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/30 to-primary/30 border border-white/10 flex items-center justify-center text-white text-2xl font-semibold mx-auto backdrop-blur-sm">
                  {employee.name.split(" ").map(n => n[0]).join("")}
                </div>
              )}
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">{employee.name}</h1>
            <p className="text-gray-400 mt-1 text-[13px]">{employee.role}</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <div className="w-4 h-[1.5px] bg-accent/60 rounded-full" />
              <span className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">mpool consulting</span>
              <div className="w-4 h-[1.5px] bg-accent/60 rounded-full" />
            </div>
          </div>

          {/* Contact */}
          <div className="px-5 pb-4 space-y-1.5 relative z-10">
            {employee.phone && (
              <a href={`tel:${employee.phone}`} className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Telefon</p>
                  <p className="text-[13px] text-gray-200">{employee.phone}</p>
                </div>
              </a>
            )}
            <a href={`mailto:${employee.email}`} className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">E-Mail</p>
                <p className="text-[13px] text-gray-200 break-all">{employee.email}</p>
              </div>
            </a>
            <a href="https://www.mpool-consulting-do.de" target="_blank" className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9"/></svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Webseite</p>
                <p className="text-[13px] text-accent font-medium">www.mpool-consulting-do.de</p>
              </div>
            </a>
            {employee.linkedin && (
              <a href={employee.linkedin} target="_blank" className="flex items-center gap-3.5 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all group">
                <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/15 flex items-center justify-center shrink-0 group-hover:bg-[#0A66C2]/25 transition-colors">
                  <svg className="w-4 h-4 text-[#5BA3E6]" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">LinkedIn</p>
                  <p className="text-[13px] text-gray-200">Profil ansehen</p>
                </div>
              </a>
            )}
          </div>

          {!preview && (
            <>
              {/* Action buttons */}
              <div className="px-5 py-3 flex gap-2.5">
                <a href={`/api/vcard/${employee.slug}`} download={`${employee.name}.vcf`} className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white py-3 rounded-xl font-semibold text-[13px] transition-colors shadow-lg shadow-accent/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                  Kontakt speichern
                </a>
                <SaveToOutlookButton slug={employee.slug} name={employee.name} />
              </div>

              {/* Divider */}
              <div className="mx-5 my-2 h-px bg-white/[0.06]" />

              {/* Contact exchange */}
              <div className="px-5 pb-6 pt-3">
                <h2 className="text-base font-bold text-white mb-0.5">Kontakt austauschen</h2>
                <p className="text-[11px] text-gray-500 mb-4">Teilen Sie Ihre Daten — wir senden Ihnen die Visitenkarte per E-Mail.</p>
                <ContactForm employeeSlug={employee.slug} employeeName={employee.name} />
              </div>
            </>
          )}

          {/* Footer brand */}
          <div className="px-5 py-3 flex items-center justify-center gap-1.5 border-t border-white/[0.05]">
            <span className="text-[11px] font-bold text-accent">m</span>
            <span className="text-[11px] font-bold text-gray-400">pool</span>
            <span className="text-[10px] text-gray-600">consulting</span>
          </div>
        </div>
      </div>
    </Wrap>
  );
}
