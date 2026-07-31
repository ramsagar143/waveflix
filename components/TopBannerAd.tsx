"use client";

import { useEffect, useState } from "react";
import AdUnit from "./AdUnit";

const MOBILE_AD = { key: "a40c02c4e7f8b27d67285d1d5cd2cf91", width: 320, height: 50 };
const DESKTOP_AD = { key: "930e6298562b44b13a12f5861365a328", width: 728, height: 90 };

// Sits right after the Hero, before the first content row — the first
// natural break on the page, so it doesn't compete with the hero CTA.
export default function TopBannerAd() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (isDesktop === null) return null;

  const ad = isDesktop ? DESKTOP_AD : MOBILE_AD;

  return (
    <div
      className="w-full flex justify-center items-center py-3 md:py-4"
      style={{ minHeight: ad.height }}
    >
      <AdUnit adKey={ad.key} width={ad.width} height={ad.height} />
    </div>
  );
}
