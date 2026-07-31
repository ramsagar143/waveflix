"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Clapperboard, Tv, Sparkles, Search, Film } from "lucide-react";
import { useState } from "react";

const TABS = [
  { href: "/", label: "Home", icon: Home, key: "H" },
  { href: "/movies", label: "Movies", icon: Clapperboard, key: "M" },
  { href: "/tv-shows", label: "TV Shows", icon: Tv, key: "T" },
  { href: "/anime", label: "Anime", icon: Sparkles, key: "A" },
  { href: "/search", label: "Search", icon: Search, key: "S" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <>
      {/* ---------- Desktop top navbar ---------- */}
      <header className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="backdrop-blur-xl bg-base-900/70 border-b border-white/5">
          <div className="max-w-[1600px] mx-auto flex items-center gap-8 px-8 h-[76px]">
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <motion.div
                whileHover={{ rotate: -8, scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-pink via-neon-violet to-neon-blue flex items-center justify-center"
              >
                <Film size={18} className="text-white" />
              </motion.div>
              <span className="font-display font-extrabold text-xl tracking-tight text-rainbow">
                WaveFlix
              </span>
            </Link>

            <nav className="flex items-center gap-1">
              {TABS.filter((t) => t.href !== "/search").map((tab) => {
                const active = isActive(tab.href);
                return (
                  <Link key={tab.href} href={tab.href} className="relative px-4 py-2 group">
                    <motion.span
                      whileTap={{ scale: 0.9 }}
                      className={`relative z-10 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                        active ? "text-white" : "text-white/55 hover:text-white/85"
                      }`}
                    >
                      {tab.label}
                      <kbd
                        className={`inline-flex items-center justify-center w-4 h-4 rounded-[5px] text-[9px] font-bold border transition-colors ${
                          active
                            ? "border-white/25 bg-white/10 text-white/70"
                            : "border-white/10 bg-white/5 text-white/35 group-hover:text-white/60 group-hover:border-white/25"
                        }`}
                      >
                        {tab.key}
                      </kbd>
                    </motion.span>
                    {active && (
                      <motion.div
                        layoutId="desktop-tab-underline"
                        className="absolute left-2 right-2 -bottom-[2px] h-[3px] rounded-full rainbow-underline"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <form onSubmit={submitSearch} className="ml-auto w-full max-w-xs">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  placeholder="Search movies, shows, anime..."
                  className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-9 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-neon-cyan/60 focus:bg-white/[0.07] transition-colors"
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-4 h-4 rounded-[5px] text-[9px] font-bold border border-white/10 bg-white/5 text-white/35">
                  S
                </kbd>
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* ---------- Mobile top mini header ---------- */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden backdrop-blur-xl bg-base-900/80 border-b border-white/5">
        <div className="flex items-center gap-2 px-4 h-[60px]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-pink via-neon-violet to-neon-blue flex items-center justify-center">
            <Film size={16} className="text-white" />
          </div>
          <span className="font-display font-extrabold text-lg text-rainbow">WaveFlix</span>
        </div>
      </header>

      {/* ---------- Mobile bottom tab bar (app-like) ---------- */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="backdrop-blur-xl bg-base-900/85 border-t border-white/10 px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between">
            {TABS.map((tab) => {
              const active = isActive(tab.href);
              const Icon = tab.icon;
              return (
                <Link key={tab.href} href={tab.href} className="flex-1">
                  <motion.div
                    whileTap={{ scale: 0.82 }}
                    className="flex flex-col items-center gap-1 py-2.5"
                  >
                    <motion.div
                      animate={active ? { y: -2 } : { y: 0 }}
                      className={`relative flex items-center justify-center w-9 h-9 rounded-xl ${
                        active ? "bg-white/10" : ""
                      }`}
                    >
                      {active && (
                        <motion.div
                          layoutId="mobile-tab-glow"
                          className="absolute inset-0 rounded-xl rainbow-underline opacity-30"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <Icon
                        size={19}
                        strokeWidth={2.3}
                        className={`relative z-10 ${active ? "text-white" : "text-white/45"}`}
                      />
                    </motion.div>
                    <span
                      className={`text-[10px] font-semibold ${
                        active ? "text-white" : "text-white/40"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
