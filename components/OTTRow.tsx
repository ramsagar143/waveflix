"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Tv2 } from "lucide-react";
import { OTTPlatform } from "@/lib/ott";
import { useDragScroll } from "@/lib/useDragScroll";
import OTTPlatformCard from "./OTTPlatformCard";

export default function OTTRow({ platforms }: { platforms: OTTPlatform[] }) {
  const { ref: scrollerRef, grabbing, dragHandlers, dragStyle } = useDragScroll<HTMLDivElement>();

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!platforms?.length) return null;

  return (
    <section className="relative py-5 md:py-7">
      <div className="flex items-end justify-between mb-4 px-4 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full rainbow-underline" />
            <h2 className="font-display font-bold text-lg md:text-2xl text-white flex items-center gap-2">
              <Tv2 size={20} className="text-neon-cyan" />
              Streaming Platforms
            </h2>
          </div>
          <p className="text-xs md:text-sm text-white/40 mt-1 ml-3.5">
            The most-watched OTTs, updated live from TMDB
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/ott">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-white px-3.5 md:px-4 py-2 rounded-full border border-white/15"
              style={{ background: "linear-gradient(120deg, #ff3ea5, #4f7dff, #8b5cf6)" }}
            >
              View All OTTs <ArrowRight size={14} />
            </motion.span>
          </Link>
          <div className="hidden md:flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              <ChevronLeft size={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
            >
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        {...dragHandlers}
        className={`flex items-start gap-4 md:gap-6 overflow-x-auto overflow-y-hidden no-scrollbar px-4 md:px-8 pt-2 pb-5 md:pt-3 md:pb-6 md:cursor-grab ${
          grabbing ? "dragging md:cursor-grabbing" : ""
        }`}
        style={dragStyle}
      >
        {platforms.map((platform, i) => (
          <OTTPlatformCard key={platform.slug} platform={platform} index={i} />
        ))}
      </div>
    </section>
  );
}
