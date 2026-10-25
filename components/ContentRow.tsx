"use client";

import Link from "next/link";
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
              {/* Plain anchor — no framer-motion wrapper needed for a simple link */}
              <span className="hidden sm:flex items-center gap-1 text-xs md:text-sm font-semibold text-white/60 hover:text-white transition-colors duration-200">
                View All <ArrowRight size={14} />
              </span>
            </Link>
          )}
          <div className="hidden md:flex items-center gap-1.5">
            {/* CSS-only active:scale instead of framer-motion whileTap */}
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 active:scale-90 transition-[colors,transform] duration-150"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 active:scale-90 transition-[colors,transform] duration-150"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollerRef}
        {...dragHandlers}
        className={`flex items-start gap-2.5 md:gap-3.5 overflow-x-auto overflow-y-hidden no-scrollbar px-4 md:px-8 pt-4 pb-5 md:pt-5 md:pb-6 md:cursor-grab ${
          grabbing ? "dragging md:cursor-grabbing" : ""
        }`}
        style={{
          ...dragStyle,
          /* Scroll container gets its own compositor layer so scroll
             position updates don't trigger repaints on the rest of the page */
          willChange: "scroll-position",
          contain: "layout style" as React.CSSProperties["contain"],
        }}
      >
        {items.map((item, i) => (
          <ContentCard key={`${item.mediaType}-${item.id}`} item={item} index={i} />
        ))}
      </div>

      {viewAllHref && (
        <div className="sm:hidden px-4 mt-3">
          <Link href={viewAllHref}>
            <span className="flex items-center justify-center gap-1 text-xs font-semibold text-white/70 border border-white/10 rounded-full py-2 active:scale-[0.97] transition-transform duration-150">
              View All <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
