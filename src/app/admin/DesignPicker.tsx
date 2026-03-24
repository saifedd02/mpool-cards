"use client";

import ClassicCard from "../card/[slug]/designs/ClassicCard";
import MinimalCard from "../card/[slug]/designs/MinimalCard";
import DarkCard from "../card/[slug]/designs/DarkCard";
import ElegantCard from "../card/[slug]/designs/ElegantCard";
import CustomCard from "../card/[slug]/designs/CustomCard";

type CardDesign = "classic" | "minimal" | "dark" | "elegant" | "custom";

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
  employee: {
    slug: string; name: string; role: string; phone: string;
    email: string; linkedin: string; website: string; photo: string;
  };
  selected: CardDesign;
  onSelect: (design: CardDesign) => void;
  customDesign?: CustomDesignSettings;
}

const designs: { id: CardDesign; label: string; desc: string }[] = [
  { id: "classic", label: "Klassisch", desc: "Blauer Header, modern" },
  { id: "minimal", label: "Minimal", desc: "Sauber, hell, reduziert" },
  { id: "dark",    label: "Dark Mode", desc: "Dunkel, elegant, tech" },
  { id: "elegant", label: "Elegant",  desc: "Gold-Akzente, Serif" },
  { id: "custom",  label: "Eigenes", desc: "Selbst gestalten" },
];

const PHONE_W = 220;
const PHONE_H = 440;
const PHONE_RADIUS = 28;
const BORDER = 5;
const CARD_SOURCE_W = 400;

const defaultCustom: CustomDesignSettings = {
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

export default function DesignPicker({ employee, selected, onSelect, customDesign }: Props) {
  const previewEmployee = {
    ...employee,
    name: employee.name || "Max Mustermann",
    role: employee.role || "Consultant",
    email: employee.email || "m.mustermann@mpool-consulting.de",
    phone: employee.phone || "+49 231 123456",
  };

  function renderPreview(designId: CardDesign) {
    const props = { employee: previewEmployee, preview: true as const };
    switch (designId) {
      case "minimal": return <MinimalCard {...props} />;
      case "dark":    return <DarkCard {...props} />;
      case "elegant": return <ElegantCard {...props} />;
      case "custom":  return <CustomCard {...props} settings={customDesign || defaultCustom} />;
      default:        return <ClassicCard {...props} />;
    }
  }

  const innerScale = PHONE_W / CARD_SOURCE_W;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Visitenkarten-Design auswählen
      </label>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {designs.map((d) => {
          const isSelected = selected === d.id;
          const isCustom = d.id === "custom";
          const screenBg = d.id === "dark" ? "bg-gray-950"
            : (isCustom && customDesign && isColorDark(customDesign.cardBg)) ? "bg-gray-950"
            : "bg-white";

          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d.id)}
              className={`group relative rounded-2xl border-2 transition-all duration-300 p-3 pb-2 cursor-pointer ${
                isSelected
                  ? "border-primary shadow-xl shadow-primary/15 ring-2 ring-primary/20 bg-primary/[0.02]"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-lg bg-white"
              }`}
            >
              {/* Phone frame */}
              <div
                className="relative mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                style={{ width: PHONE_W + BORDER * 2, height: PHONE_H + BORDER * 2 }}
              >
                <div
                  className="absolute inset-0 bg-[#1a1a1a] shadow-lg"
                  style={{ borderRadius: PHONE_RADIUS + BORDER }}
                />

                {/* Side buttons */}
                <div className="absolute -left-[2px] top-[80px] w-[2px] h-[20px] bg-[#2a2a2a] rounded-l" />
                <div className="absolute -left-[2px] top-[110px] w-[2px] h-[30px] bg-[#2a2a2a] rounded-l" />
                <div className="absolute -left-[2px] top-[145px] w-[2px] h-[30px] bg-[#2a2a2a] rounded-l" />
                <div className="absolute -right-[2px] top-[110px] w-[2px] h-[40px] bg-[#2a2a2a] rounded-r" />

                <div
                  className={`absolute overflow-hidden ${screenBg}`}
                  style={{
                    top: BORDER,
                    left: BORDER,
                    width: PHONE_W,
                    height: PHONE_H,
                    borderRadius: PHONE_RADIUS,
                  }}
                >
                  <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[60px] h-[16px] bg-black rounded-full z-30 flex items-center justify-end pr-[5px]">
                    <div className="w-[6px] h-[6px] rounded-full bg-[#1a1a2e] ring-1 ring-[#2a2a3e]" />
                  </div>

                  <div
                    className="origin-top-left"
                    style={{
                      transform: `scale(${innerScale})`,
                      width: CARD_SOURCE_W,
                      minHeight: PHONE_H / innerScale,
                    }}
                  >
                    {renderPreview(d.id)}
                  </div>
                </div>

                <div
                  className="absolute bottom-[7px] left-1/2 -translate-x-1/2 h-[4px] rounded-full bg-gray-500/80"
                  style={{ width: PHONE_W * 0.33 }}
                />
              </div>

              {/* Label */}
              <div className="mt-3 text-center">
                <p className={`text-sm font-semibold transition-colors ${isSelected ? "text-primary" : "text-gray-900"}`}>
                  {d.label}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{d.desc}</p>
              </div>

              {/* Custom icon */}
              {isCustom && !isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 z-10">
                  <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function isColorDark(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}
