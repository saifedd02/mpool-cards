"use client";

import { type CSSProperties, useState } from "react";

interface SaveContactButtonProps {
  slug: string;
  name: string;
  label?: string;
  loadingLabel?: string;
  className?: string;
  style?: CSSProperties;
}

export default function SaveContactButton({
  slug,
  name,
  label = "Kontakt speichern",
  loadingLabel = "Wird vorbereitet...",
  className,
  style,
}: SaveContactButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/vcard/${slug}`);
      if (!response.ok) {
        throw new Error("vCard download failed");
      }

      const blob = await response.blob();
      const file = new File([blob], `${name}.vcf`, { type: "text/vcard" });

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
          // User canceled the share sheet or the OS refused the share target.
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      style={style}
    >
      <svg
        className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isLoading ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v4m0 8v4m8-8h-4M8 12H4m13.657-5.657-2.829 2.829M9.172 14.828l-2.829 2.829m0-11.314 2.829 2.829m8.486 8.485-2.829-2.829"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
          />
        )}
      </svg>
      {isLoading ? loadingLabel : label}
    </button>
  );
}
