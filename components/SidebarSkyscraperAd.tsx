"use client";

import { useEffect, useState } from "react";
import AdUnit from "./AdUnit";

const LEFT_AD = { key: "76dc4cf36aad2305ef9f7de4260e0c57", width: 160, height: 300 };
const RIGHT_AD = { key: "4d2c65491ee3376578acfc33ec5dff77", width: 160, height: 600 };

// Content is centered with a 1600px max-width, so on ultra-wide monitors
// there's dead space on both sides. This renders two sticky skyscrapers
// into that space — and stays completely hidden below ~1900px so it never
// overlaps content on laptops, tablets, or phones.
export default function SidebarSkyscraperAd() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1900px)");
    setShow(mq.matches);
    const handler = (e: MediaQueryListEvent) => setShow(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (!show) return null;

  return (
    <>
      <div
        className="fixed z-30"
        style={{ top: 96, left: 24 }}
      >
        <AdUnit adKey={LEFT_AD.key} width={LEFT_AD.width} height={LEFT_AD.height} />
      </div>
      <div
        className="fixed z-30"
        style={{ top: 96, right: 24 }}
      >
        <AdUnit adKey={RIGHT_AD.key} width={RIGHT_AD.width} height={RIGHT_AD.height} />
      </div>
    </>
  );
}
