"use client";

interface Props {
  slug: string;
  name: string;
}

export default function SaveToOutlookButton({ slug, name }: Props) {
  const handleClick = async () => {
    const response = await fetch(`/api/vcard/${slug}?outlook=1`);
    const blob = await response.blob();
    const file = new File([blob], `${name}.vcf`, { type: "text/vcard" });

    // iOS/Android: Öffnet den nativen Share-Sheet → User wählt Outlook
    if (
      typeof navigator !== "undefined" &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: `Kontakt: ${name}`,
        });
        return;
      } catch {
        // User hat abgebrochen oder Fehler → Fallback
      }
    }

    // Desktop Fallback: Datei herunterladen
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleClick}
      className="flex-1 flex items-center justify-center gap-2 bg-[#0078D4] hover:bg-[#106EBE] text-white py-3.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.16.154-.352.23-.578.23h-8.07v-6.16l1.37 1.008c.096.063.208.095.338.095s.243-.032.34-.095L24 8.59v-1.2h-.002zm-9.262 6.618l-.576-.47-5.863 3.672c.082.044.2.066.354.066h14.64c.06 0 .15-.02.27-.066l-5.74-3.614-.577.412a.71.71 0 01-.252.098.71.71 0 01-.256-.098zm-1.624-1.242v-1.07l-.824-.584v7.562h-2.34V7.673H7.59v10.998H2.676V5.33h7.69l2.748 7.433zm7.772-5.09h-7.772v4.97l3.875-2.736 3.897 2.458V7.673zM7.89 0L0 3.396v17.21l7.89 3.393V0z" />
      </svg>
      In Outlook speichern
    </button>
  );
}
