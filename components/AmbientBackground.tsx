"use client";

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-base-900">
      {/* base gradient wash — static, no animation needed */}
      <div className="absolute inset-0 bg-rainbow-radial" />

      {/* animated glow blobs — GPU-promoted via will-change (set in CSS).
          Only 2 blobs instead of 3 to reduce composited layer count.
          animation-fill-mode: both ensures no flash before/after. */}
      <div className="glow-blob w-[420px] h-[420px] -top-24 -left-24 animate-glow-pulse" />
      <div
        className="glow-blob w-[340px] h-[340px] top-1/3 -right-16 animate-glow-pulse"
        style={{
          animationDelay: "1.4s",
          background: "radial-gradient(circle, rgba(34,226,214,0.38), transparent 70%)",
        }}
      />

      {/* Animated wave — width 150% instead of 200% (less off-screen pixels
          to composite), opacity lowered to further reduce GPU fill cost. */}
      <svg
        className="absolute bottom-0 left-0 w-[150%] opacity-15 animate-wave-flow"
        style={{
          animationDuration: "20s",
          /* Promote SVG to its own compositor layer */
          willChange: "transform",
          transform: "translateZ(0)",
        }}
        viewBox="0 0 2800 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff3ea5" />
            <stop offset="25%" stopColor="#ffd23d" />
            <stop offset="50%" stopColor="#3ddc84" />
            <stop offset="75%" stopColor="#4f7dff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M0,100 C200,180 400,20 600,100 C800,180 1000,20 1200,100 C1400,180 1600,20 1800,100 C2000,180 2200,20 2400,100 C2600,180 2700,60 2800,100 L2800,200 L0,200 Z"
          fill="url(#waveGrad)"
        />
      </svg>

      {/* subtle grid overlay for texture — static, no GPU cost */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
