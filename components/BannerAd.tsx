"use client";

import { useEffect, useState } from "react";
import AdUnit from "./AdUnit";

const MOBILE_AD = { key: "eb6458414421a2525303da5dcd06f6f9", width: 468, height: 60 };
const DESKTOP_AD = { key: "930e6298562b44b13a12f5861365a328", width: 728, height: 90 };

// Bottom-of-page banner. Swaps creative size at the md breakpoint so it
// always fits the viewport — 468x60 on mobile/tablet, 728x90 on desktop.
export default function BannerAd() {
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
      className="w-full flex justify-center items-center py-4 md:py-5"
      style={{ minHeight: ad.height }}
    >
      <AdUnit adKey={ad.key} width={ad.width} height={ad.height} />
    </div>
  );
}
