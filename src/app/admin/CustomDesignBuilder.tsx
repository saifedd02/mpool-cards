"use client";

import CustomCard from "../card/[slug]/designs/CustomCard";

interface CustomDesignSettings {
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

interface Props {
  settings: CustomDesignSettings;
  onChange: (settings: CustomDesignSettings) => void;
  employee: {
    slug: string; name: string; role: string; phone: string;
    email: string; linkedin: string; website: string; photo: string;
  };
}

const COLOR_PRESETS = [
  { label: "Navy", value: "#003087" },
  { label: "Blue", value: "#0057B8" },
  { label: "Royal", value: "#1a56db" },
  { label: "Sky", value: "#2563eb" },
  { label: "Teal", value: "#0d9488" },
  { label: "Emerald", value: "#059669" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Violet", value: "#6d28d9" },
  { label: "Rose", value: "#e11d48" },
  { label: "Orange", value: "#ea580c" },
  { label: "Slate", value: "#475569" },
  { label: "Black", value: "#111827" },
];

const DARK_PRESETS = [
  { label: "Dunkel", cardBg: "#111118", bgColor: "#0a0a0f", textColor: "#f9fafb", subtextColor: "#9ca3af" },
  { label: "Anthrazit", cardBg: "#1c1c24", bgColor: "#111116", textColor: "#f3f4f6", subtextColor: "#9ca3af" },
  { label: "Marine", cardBg: "#0c1929", bgColor: "#060f1d", textColor: "#e5e7eb", subtextColor: "#94a3b8" },
];

const LIGHT_PRESETS = [
  { label: "Weiß", cardBg: "#ffffff", bgColor: "#f8fafc", textColor: "#111827", subtextColor: "#6b7280" },
  { label: "Warm", cardBg: "#fffbf5", bgColor: "#faf5ee", textColor: "#1c1917", subtextColor: "#78716c" },
  { label: "Cool", cardBg: "#f8faff", bgColor: "#eef2ff", textColor: "#1e1b4b", subtextColor: "#6366f1" },
];

export default function CustomDesignBuilder({ settings, onChange, employee }: Props) {
  const s = settings;
  const set = (partial: Partial<CustomDesignSettings>) => onChange({ ...s, ...partial });

  const previewEmployee = {
    ...employee,
    name: employee.name || "Max Mustermann",
    role: employee.role || "Consultant",
    email: employee.email || "m.mustermann@mpool-consulting.de",
    phone: employee.phone || "+49 231 123456",
  };

  return (
    <div className="mt-6 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 bg-white border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Eigenes Design erstellen
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-0">
        {/* Settings Panel */}
        <div className="p-5 space-y-6 border-r border-gray-200">

          {/* Farbschema */}
          <Section title="Hauptfarbe">
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => set({ primaryColor: c.value })}
                  className={`w-8 h-8 rounded-lg transition-all ${s.primaryColor === c.value ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "hover:scale-105"}`}
                  style={{ background: c.value }}
                />
              ))}
              <label className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden relative">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <input
                  type="color"
                  value={s.primaryColor}
                  onChange={(e) => set({ primaryColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </Section>

          <Section title="Akzentfarbe">
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onClick={() => set({ accentColor: c.value })}
                  className={`w-8 h-8 rounded-lg transition-all ${s.accentColor === c.value ? "ring-2 ring-offset-2 ring-gray-900 scale-110" : "hover:scale-105"}`}
                  style={{ background: c.value }}
                />
              ))}
              <label className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden relative">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <input
                  type="color"
                  value={s.accentColor}
                  onChange={(e) => set({ accentColor: e.target.value })}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </Section>

          {/* Hintergrund-Modus */}
          <Section title="Hintergrund">
            <div className="space-y-2">
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Hell</p>
              <div className="flex gap-2">
                {LIGHT_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => set({ cardBg: p.cardBg, bgColor: p.bgColor, textColor: p.textColor, subtextColor: p.subtextColor })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      s.cardBg === p.cardBg
                        ? "border-gray-900 bg-white text-gray-900 shadow-sm"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-5 h-5 rounded mx-auto mb-1 border border-gray-200" style={{ background: p.cardBg }} />
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-3">Dunkel</p>
              <div className="flex gap-2">
                {DARK_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => set({ cardBg: p.cardBg, bgColor: p.bgColor, textColor: p.textColor, subtextColor: p.subtextColor })}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                      s.cardBg === p.cardBg
                        ? "border-gray-900 bg-white text-gray-900 shadow-sm"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-5 h-5 rounded mx-auto mb-1 border border-gray-200" style={{ background: p.cardBg }} />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Header-Stil */}
          <Section title="Header-Stil">
            <div className="flex gap-2">
              {(["gradient", "solid", "none"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => set({ headerStyle: style })}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    s.headerStyle === style
                      ? "border-gray-900 bg-white text-gray-900 shadow-sm"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {style === "gradient" ? "Verlauf" : style === "solid" ? "Einfarbig" : "Ohne"}
                </button>
              ))}
            </div>
          </Section>

          {/* Layout */}
          <Section title="Layout">
            <div className="flex gap-2">
              {(["center", "left"] as const).map((layout) => (
                <button
                  key={layout}
                  type="button"
                  onClick={() => set({ layout })}
                  className={`flex-1 py-2.5 px-3 rounded-lg border text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                    s.layout === layout
                      ? "border-gray-900 bg-white text-gray-900 shadow-sm"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {layout === "center" ? (
                    <>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-4 h-4 rounded-full bg-gray-300" />
                        <div className="w-8 h-1 rounded bg-gray-300" />
                        <div className="w-6 h-1 rounded bg-gray-200" />
                      </div>
                      Zentriert
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-gray-300" />
                        <div className="flex flex-col gap-0.5">
                          <div className="w-6 h-1 rounded bg-gray-300" />
                          <div className="w-4 h-1 rounded bg-gray-200" />
                        </div>
                      </div>
                      Links
                    </>
                  )}
                </button>
              ))}
            </div>
          </Section>

          {/* Schriftart, Ecken, Icons */}
          <div className="grid grid-cols-3 gap-4">
            <Section title="Schrift">
              <div className="flex gap-1.5">
                {(["sans", "serif"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => set({ fontStyle: f })}
                    className={`flex-1 py-1.5 rounded-md border text-xs transition-all ${
                      s.fontStyle === f
                        ? "border-gray-900 bg-white text-gray-900 shadow-sm font-semibold"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    } ${f === "serif" ? "font-serif" : "font-sans"}`}
                  >
                    {f === "sans" ? "Aa" : "Aa"}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Ecken">
              <div className="flex gap-1.5">
                {(["sm", "md", "lg"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => set({ borderRadius: r })}
                    className={`flex-1 py-1.5 rounded-md border text-xs transition-all ${
                      s.borderRadius === r
                        ? "border-gray-900 bg-white text-gray-900 shadow-sm font-semibold"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {r === "sm" ? "S" : r === "md" ? "M" : "L"}
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Icons">
              <div className="flex gap-1.5">
                {(["circle", "square", "none"] as const).map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => set({ iconStyle: i })}
                    className={`flex-1 py-1.5 rounded-md border text-xs transition-all flex items-center justify-center ${
                      s.iconStyle === i
                        ? "border-gray-900 bg-white text-gray-900 shadow-sm"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {i === "circle" ? (
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                    ) : i === "square" ? (
                      <div className="w-4 h-4 rounded border-2 border-current" />
                    ) : (
                      <span className="text-[10px]">—</span>
                    )}
                  </button>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {/* Live Preview */}
        <div className="p-5 bg-gray-100/50 flex flex-col items-center">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-3">Vorschau</p>
          <div className="w-[240px] relative">
            {/* Phone frame */}
            <div className="relative" style={{ paddingTop: "200%" }}>
              <div className="absolute inset-0">
                {/* Shell */}
                <div className="absolute inset-0 bg-[#1a1a1a] rounded-[32px]" />
                {/* Screen */}
                <div
                  className="absolute overflow-hidden rounded-[26px]"
                  style={{ top: 6, left: 6, right: 6, bottom: 6 }}
                >
                  {/* Dynamic Island */}
                  <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[56px] h-[14px] bg-black rounded-full z-30" />
                  {/* Card content scaled */}
                  <div
                    className="origin-top-left"
                    style={{
                      transform: `scale(${228 / 400})`,
                      width: 400,
                      minHeight: 480 / (228 / 400),
                    }}
                  >
                    <CustomCard employee={previewEmployee} preview settings={s} />
                  </div>
                </div>
                {/* Home indicator */}
                <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[75px] h-[4px] rounded-full bg-gray-500/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-2">{title}</label>
      {children}
    </div>
  );
}
