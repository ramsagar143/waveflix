import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          900: "#07070c",
          800: "#0c0c16",
          700: "#121220",
          600: "#1a1a2e",
        },
        neon: {
          pink: "#ff3ea5",
          violet: "#8b5cf6",
          blue: "#4f7dff",
          cyan: "#22e2d6",
          green: "#3ddc84",
          yellow: "#ffd23d",
          orange: "#ff8a3d",
          red: "#ff4d6d",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "rainbow-line":
          "linear-gradient(90deg, #ff3ea5, #ff8a3d, #ffd23d, #3ddc84, #22e2d6, #4f7dff, #8b5cf6, #ff3ea5)",
        "rainbow-radial":
          "radial-gradient(circle at 30% 20%, rgba(139,92,246,0.35), transparent 60%), radial-gradient(circle at 80% 0%, rgba(34,226,214,0.25), transparent 55%), radial-gradient(circle at 50% 100%, rgba(255,62,165,0.25), transparent 60%)",
      },
      keyframes: {
        "wave-flow": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "float-y": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.55", filter: "blur(18px)" },
          "50%": { opacity: "0.9", filter: "blur(24px)" },
        },
        "fly-in-up": {
          "0%": { transform: "translateY(40px) scale(0.9)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        "wave-flow": "wave-flow 6s linear infinite",
        "float-y": "float-y 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3.5s ease-in-out infinite",
        "fly-in-up": "fly-in-up 0.5s cubic-bezier(.22,1,.36,1) both",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
