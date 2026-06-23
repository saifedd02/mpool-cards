"use client";

import { useEffect, useState } from "react";

interface Props {
  slug: string;
  /** Compact = side-by-side in the admin QR modal; default = full-width on the card. */
  compact?: boolean;
}

type WalletConfig = { apple: boolean; google: boolean };

export default function AddToWalletButtons({ slug, compact }: Props) {
  const [cfg, setCfg] = useState<WalletConfig | null>(null);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");

  useEffect(() => {
    fetch("/api/wallet/config")
      .then((r) => r.json())
      .then(setCfg)
      .catch(() => setCfg({ apple: false, google: false }));

    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    if (/iPhone|iPad|iPod/i.test(ua)) setPlatform("ios");
    else if (/Android/i.test(ua)) setPlatform("android");
  }, []);

  if (!cfg) return null;

  const showApple = cfg.apple && platform !== "android";
  const showGoogle = cfg.google && platform !== "ios";
  if (!showApple && !showGoogle) return null;

  const base =
    "flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors";
  const size = compact ? "px-4 py-2 text-xs" : "flex-1 py-3.5 text-sm";

  return (
    <div className={compact ? "flex gap-2" : "flex gap-2.5"}>
      {showApple && (
        <a
          href={`/api/wallet/apple/${slug}`}
          className={`${base} ${size} bg-black hover:bg-gray-800 text-white`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 12.04c-.03-2.5 2.04-3.7 2.13-3.76-1.16-1.7-2.97-1.93-3.61-1.96-1.54-.16-3 .9-3.78.9-.77 0-1.97-.88-3.24-.86-1.67.02-3.21.97-4.07 2.47-1.73 3-.44 7.45 1.25 9.89.82 1.19 1.8 2.53 3.08 2.48 1.24-.05 1.71-.8 3.21-.8 1.49 0 1.92.8 3.23.78 1.33-.02 2.18-1.21 3-2.41.94-1.38 1.33-2.72 1.35-2.79-.03-.01-2.59-.99-2.61-3.93zM14.53 4.6c.68-.83 1.14-1.98 1.01-3.13-.98.04-2.17.65-2.87 1.48-.63.73-1.18 1.9-1.03 3.02 1.09.09 2.21-.55 2.89-1.37z" />
          </svg>
          {compact ? "Apple Wallet" : "Zu Apple Wallet"}
        </a>
      )}
      {showGoogle && (
        <a
          href={`/api/wallet/google/${slug}`}
          className={`${base} ${size} bg-black hover:bg-gray-800 text-white`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm2.5-.5a.5.5 0 0 0-.5.5V12h14V5.5a.5.5 0 0 0-.5-.5h-13Z" />
          </svg>
          {compact ? "Google Wallet" : "Zu Google Wallet"}
        </a>
      )}
    </div>
  );
}
