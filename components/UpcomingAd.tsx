"use client";

import { openSmartlink } from "@/lib/ads";

// Inline banner — floating popup nahi, page content ke saath hi flow karta hai
export default function UpcomingAd() {
  return (
    <div
      onClick={openSmartlink}
      className="mx-4 md:mx-8 my-2 rounded-2xl overflow-hidden cursor-pointer select-none"
      style={{
        background: "linear-gradient(135deg, #0f0f1a 0%, #1a0f2e 100%)",
        border: "1px solid rgba(255,62,165,0.25)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      {/* Top gradient line */}
      <div style={{
        height: "2px",
        background: "linear-gradient(90deg, #ff3ea5, #4f7dff, #8b5cf6, #ff3ea5)",
      }} />

      <div className="flex items-center gap-4 px-4 py-3">
        {/* Left: UPCOMING label + titles */}
        <div className="flex-1 min-w-0">
          <p style={{
            color: "#ff3ea5",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}>
            🎬 UPCOMING
          </p>
          <p className="text-white/60 text-[11px] leading-snug truncate">
            Money Heist S6 &nbsp;·&nbsp; From S5 &nbsp;·&nbsp; Pushpa 3 &nbsp;·&nbsp; KGF Chapter 3
          </p>
        </div>

        {/* Right: WATCH NOW */}
        <div className="shrink-0 text-right">
          <p style={{
            fontSize: "15px",
            fontWeight: 900,
            letterSpacing: "-0.3px",
            background: "linear-gradient(90deg, #ff3ea5, #4f7dff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: "var(--font-display, sans-serif)",
            lineHeight: 1.1,
          }}>
            WATCH<br />NOW
          </p>
          <p style={{ fontSize: "8px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", marginTop: "2px" }}>
            SPONSORED
          </p>
        </div>
      </div>
    </div>
  );
}
