"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const SORTS = [
  { key: "popular", label: "Popular" },
  { key: "trending", label: "Trending" },
  { key: "top_rated", label: "Top Rated" },
  { key: "now_playing", label: "New" },
];

export default function CategoryHeader({
  title,
  description,
  basePath,
  activeSort,
  accent = "#ff3ea5",
}: {
  title: string;
  description: string;
  basePath: string;
  activeSort: string;
  accent?: string;
}) {
  return (
    <div className="wave-bg px-4 md:px-8 pt-8 pb-6 md:pt-14 md:pb-10 mb-2">
      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display font-extrabold text-3xl md:text-5xl text-white mb-2"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-white/50 text-sm md:text-base mb-6 max-w-xl"
        >
          {description}
        </motion.p>

        <div className="flex flex-wrap gap-2">
          {SORTS.map((s) => {
            const active = activeSort === s.key;
            return (
              <Link key={s.key} href={`${basePath}?sort=${s.key}`}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className={`inline-block px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-colors ${
                    active
                      ? "text-white border-transparent"
                      : "text-white/50 border-white/10 hover:text-white hover:border-white/25"
                  }`}
                  style={active ? { background: accent } : {}}
                >
                  {s.label}
                </motion.span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
