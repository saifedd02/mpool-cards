import ContactForm from "../ContactForm";
import SaveToOutlookButton from "../SaveToOutlookButton";

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
  preview?: boolean;
  settings: CustomDesignSettings;
}

function isColorDark(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

const radiusMap = { sm: "12px", md: "16px", lg: "24px" };

export default function CustomCard({ employee, preview = false, settings: s }: Props) {
  const Wrap = preview ? "div" : "main";
  const isDarkCard = isColorDark(s.cardBg);
  const isDarkHeader = s.headerStyle !== "none" && isColorDark(s.primaryColor);
  const hasHeader = s.headerStyle !== "none";
  const fontClass = s.fontStyle === "serif" ? "font-serif" : "font-sans";
  const cardRadius = radiusMap[s.borderRadius];

  const headerBg =
    s.headerStyle === "gradient"
      ? `linear-gradient(135deg, ${s.primaryColor}, ${s.accentColor})`
      : s.headerStyle === "solid"
      ? s.primaryColor
      : "transparent";

  const headerTextColor = hasHeader && isDarkHeader ? "#ffffff" : s.textColor;
  const headerSubColor = hasHeader && isDarkHeader ? "rgba(255,255,255,0.7)" : s.subtextColor;

  const iconBg = hexToRgba(s.primaryColor, isDarkCard ? 0.15 : 0.08);
  const iconHoverBg = s.primaryColor;
  const iconRadius = s.iconStyle === "circle" ? "9999px" : s.iconStyle === "square" ? "8px" : "0";
  const showIconBox = s.iconStyle !== "none";

  return (
    <Wrap
      className={fontClass}
      style={preview ? {} : {
        minHeight: "100vh",
        background: s.bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: preview ? "400px" : "448px" }}>
        <div
          style={{
            background: s.cardBg,
            borderRadius: cardRadius,
            overflow: "hidden",
            boxShadow: "0 8px 40px -12px rgba(0,0,0,0.12)",
            border: `1px solid ${isDarkCard ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          {/* Header */}
          {hasHeader ? (
            <div
              style={{
                background: headerBg,
                padding: s.layout === "center" ? "40px 28px 48px" : "32px 28px 40px",
                position: "relative",
              }}
            >
              {s.layout === "center" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "16px" }}>
                    {employee.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: s.iconStyle === "square" ? "12px" : "50%",
                          objectFit: "cover",
                          margin: "0 auto",
                          border: `2px solid ${isDarkHeader ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: s.iconStyle === "square" ? "12px" : "50%",
                          background: isDarkHeader ? "rgba(255,255,255,0.15)" : hexToRgba(s.primaryColor, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: headerTextColor,
                          fontSize: "24px",
                          fontWeight: 600,
                          margin: "0 auto",
                          border: `2px solid ${isDarkHeader ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                        }}
                      >
                        {employee.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <h1 style={{ fontSize: "20px", fontWeight: 700, color: headerTextColor, letterSpacing: "-0.01em" }}>
                    {employee.name}
                  </h1>
                  <p style={{ color: headerSubColor, marginTop: "4px", fontSize: "13px", fontWeight: 500 }}>
                    {employee.role}
                  </p>
                  <p style={{ color: isDarkHeader ? "rgba(255,255,255,0.4)" : s.subtextColor, fontSize: "10px", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                    mpool consulting
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flexShrink: 0 }}>
                    {employee.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: s.iconStyle === "square" ? "10px" : "50%",
                          objectFit: "cover",
                          border: `2px solid ${isDarkHeader ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: s.iconStyle === "square" ? "10px" : "50%",
                          background: isDarkHeader ? "rgba(255,255,255,0.15)" : hexToRgba(s.primaryColor, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: headerTextColor,
                          fontSize: "20px",
                          fontWeight: 600,
                          border: `2px solid ${isDarkHeader ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                        }}
                      >
                        {employee.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <div style={{ paddingTop: "2px" }}>
                    <h1 style={{ fontSize: "18px", fontWeight: 700, color: headerTextColor, letterSpacing: "-0.01em" }}>
                      {employee.name}
                    </h1>
                    <p style={{ color: headerSubColor, marginTop: "2px", fontSize: "13px", fontWeight: 500 }}>
                      {employee.role}
                    </p>
                    <p style={{ color: isDarkHeader ? "rgba(255,255,255,0.4)" : s.subtextColor, fontSize: "10px", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                      mpool consulting
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* No header mode */
            <div style={{ padding: s.layout === "center" ? "36px 28px 24px" : "28px 28px 20px" }}>
              {s.layout === "center" ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ marginBottom: "16px" }}>
                    {employee.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: s.iconStyle === "square" ? "12px" : "50%",
                          objectFit: "cover",
                          margin: "0 auto",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "72px",
                          height: "72px",
                          borderRadius: s.iconStyle === "square" ? "12px" : "50%",
                          background: hexToRgba(s.primaryColor, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: s.primaryColor,
                          fontSize: "22px",
                          fontWeight: 600,
                          margin: "0 auto",
                        }}
                      >
                        {employee.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <h1 style={{ fontSize: "20px", fontWeight: 700, color: s.textColor }}>{employee.name}</h1>
                  <p style={{ color: s.subtextColor, marginTop: "4px", fontSize: "13px" }}>{employee.role}</p>
                  <p style={{ color: s.subtextColor, fontSize: "10px", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, opacity: 0.6 }}>
                    mpool consulting
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flexShrink: 0 }}>
                    {employee.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: s.iconStyle === "square" ? "10px" : "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "60px",
                          height: "60px",
                          borderRadius: s.iconStyle === "square" ? "10px" : "50%",
                          background: hexToRgba(s.primaryColor, 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: s.primaryColor,
                          fontSize: "20px",
                          fontWeight: 600,
                        }}
                      >
                        {employee.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 style={{ fontSize: "18px", fontWeight: 700, color: s.textColor }}>{employee.name}</h1>
                    <p style={{ color: s.subtextColor, marginTop: "2px", fontSize: "13px" }}>{employee.role}</p>
                    <p style={{ color: s.subtextColor, fontSize: "10px", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, opacity: 0.6 }}>
                      mpool consulting
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          {hasHeader && (
            <div style={{ margin: "-12px 20px 0", position: "relative", zIndex: 5 }}>
              <div style={{ background: s.cardBg, borderRadius: "12px", padding: "2px", boxShadow: "0 2px 12px -4px rgba(0,0,0,0.06)" }} />
            </div>
          )}

          {/* Contact info */}
          <div style={{ padding: "20px 24px 16px" }}>
            {[
              ...(employee.phone
                ? [{ href: `tel:${employee.phone}`, label: "Telefon", value: employee.phone, icon: "phone" }]
                : []),
              { href: `mailto:${employee.email}`, label: "E-Mail", value: employee.email, icon: "email" },
              { href: "https://www.mpool-consulting-do.de", label: "Webseite", value: "www.mpool-consulting-do.de", icon: "web", target: "_blank", highlight: true },
              ...(employee.linkedin
                ? [{ href: employee.linkedin, label: "LinkedIn", value: "Profil ansehen", icon: "linkedin", target: "_blank" }]
                : []),
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target={item.target}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 0",
                  textDecoration: "none",
                  borderBottom: `1px solid ${isDarkCard ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
                }}
              >
                {showIconBox && (
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: iconRadius,
                      background: item.icon === "linkedin" ? hexToRgba("#0A66C2", isDarkCard ? 0.15 : 0.08) : iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <ContactIcon type={item.icon} color={item.icon === "linkedin" ? "#0A66C2" : s.primaryColor} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "10px", fontWeight: 500, color: s.subtextColor, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1px" }}>
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: item.highlight ? s.primaryColor : s.textColor,
                      fontWeight: item.highlight ? 600 : 400,
                      wordBreak: "break-all",
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {!preview && (
            <>
              {/* Buttons */}
              <div style={{ padding: "0 24px 12px", display: "flex", gap: "10px" }}>
                <a
                  href={`/api/vcard/${employee.slug}`}
                  download={`${employee.name}.vcf`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-[13px] transition-colors"
                  style={{
                    background: s.primaryColor,
                    color: isColorDark(s.primaryColor) ? "#fff" : "#111",
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                  Kontakt speichern
                </a>
                <SaveToOutlookButton slug={employee.slug} name={employee.name} />
              </div>

              {/* Divider */}
              <div style={{ margin: "8px 24px", height: "1px", background: isDarkCard ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

              {/* Contact form */}
              <div style={{ padding: "12px 24px 24px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: 700, color: s.textColor, marginBottom: "2px" }} className={fontClass}>
                  Kontakt austauschen
                </h2>
                <p style={{ fontSize: "11px", color: s.subtextColor, marginBottom: "16px" }}>
                  Teilen Sie Ihre Daten — wir senden Ihnen die Visitenkarte per E-Mail.
                </p>
                <ContactForm employeeSlug={employee.slug} employeeName={employee.name} />
              </div>
            </>
          )}

          {/* Footer */}
          <div
            style={{
              padding: "10px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              borderTop: `1px solid ${isDarkCard ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
              background: isDarkCard ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: s.accentColor }}>m</span>
            <span style={{ fontSize: "11px", fontWeight: 700, color: isDarkCard ? "#ccc" : "#374151" }}>pool</span>
            <span style={{ fontSize: "10px", color: s.subtextColor }}>consulting</span>
          </div>
        </div>
      </div>
    </Wrap>
  );
}

function ContactIcon({ type, color }: { type: string; color: string }) {
  const style = { width: "16px", height: "16px", color };
  switch (type) {
    case "phone":
      return <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>;
    case "email":
      return <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>;
    case "web":
      return <svg style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9"/></svg>;
    case "linkedin":
      return <svg style={style} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
    default:
      return null;
  }
}
