"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ContentItem } from "@/lib/tmdb";
import { useDragScroll } from "@/lib/useDragScroll";
import ContentCard from "./ContentCard";

export default function ContentRow({
  title,
  subtitle,
  items,
  viewAllHref,
  accent = "#ff3ea5",
}: {
  title: string;
  subtitle?: string;
  items: ContentItem[];
  viewAllHref?: string;
  accent?: string;
}) {
  const { ref: scrollerRef, grabbing, dragHandlers, dragStyle } = useDragScroll<HTMLDivElement>();

  const scroll = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  if (!items?.length) return null;

  return (
    <section className="relative py-6 md:py-8">
      <div className="flex items-end justify-between mb-4 px-4 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-5 rounded-full"
              style={{ background: accent }}
            />
            <h2 className="font-display font-bold text-lg md:text-2xl text-white">
              {title}
            </h2>
          </div>
          {subtitle && <p className="text-xs md:text-sm text-white/40 mt-1 ml-3.5">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link href={viewAllHref}>
              <motion.span
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.94 }}
                className="hidden sm:flex items-center gap-1 text-xs md:text-sm font-semibold text-white/60 hover:text-white transition-colors"
              >
                View All <ArrowRight size={14} />
              </motion.span>
            </Link>
          )}
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
        className={`flex items-start gap-2.5 md:gap-3.5 overflow-x-auto overflow-y-hidden no-scrollbar px-4 md:px-8 pt-4 pb-5 md:pt-5 md:pb-6 md:cursor-grab ${
          grabbing ? "dragging md:cursor-grabbing" : ""
        }`}
        style={dragStyle}
      >
        {items.map((item, i) => (
          <ContentCard key={`${item.mediaType}-${item.id}`} item={item} index={i} />
        ))}
      </div>

      {viewAllHref && (
        <div className="sm:hidden px-4 mt-3">
          <Link href={viewAllHref}>
            <motion.span
              whileTap={{ scale: 0.96 }}
              className="flex items-center justify-center gap-1 text-xs font-semibold text-white/70 border border-white/10 rounded-full py-2"
            >
              View All <ArrowRight size={13} />
            </motion.span>
          </Link>
        </div>
      )}
    </section>
  );
}
