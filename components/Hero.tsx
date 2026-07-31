"use client";

import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ContentItem, img } from "@/lib/tmdb";
import { detailsUrl } from "@/lib/utils";

export default function Hero({ items }: { items: ContentItem[] }) {
  const [active, setActive] = useState(0);
  const featured = items.slice(0, 6);

  useEffect(() => {
    if (featured.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % featured.length), 6500);
    return () => clearInterval(t);
  }, [featured.length]);

  if (!featured.length) return null;
  const item = featured[active];

  return (
    <section className="relative h-[62vh] md:h-[78vh] min-h-[420px] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <SafeImage
            src={img.backdrop(item.backdropPath, "w1280")}
            fallbackSrc="/placeholder-backdrop.svg"
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-900 via-base-900/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-base-900/95 md:from-base-900/85 via-base-900/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* animated wave divider at bottom of hero */}
      <svg
        className="absolute bottom-0 left-0 w-[200%] animate-wave-flow opacity-70"
        style={{ animationDuration: "14s" }}
        viewBox="0 0 2800 80"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="heroWave" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ff3ea5" />
            <stop offset="30%" stopColor="#ffd23d" />
            <stop offset="60%" stopColor="#22e2d6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          d="M0,40 C300,80 500,0 800,40 C1100,80 1300,0 1600,40 C1900,80 2100,0 2400,40 C2600,65 2700,50 2800,40 L2800,80 L0,80 Z"
          fill="url(#heroWave)"
          opacity="0.5"
        />
      </svg>

      <div className="relative z-10 h-full flex flex-col justify-end px-4 md:px-8 pb-10 md:pb-16 max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id + "-copy"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-neon-cyan">
                Trending Now
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-neon-yellow">
                <Star size={12} fill="currentColor" strokeWidth={0} />
                {item.rating.toFixed(1)}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl md:text-5xl leading-tight text-white mb-3 drop-shadow-lg">
              {item.title}
            </h1>
            <p className="text-white/70 text-sm md:text-base line-clamp-3 mb-6">
              {item.overview}
            </p>
            <div className="flex items-center gap-3">
              <Link href={`/watch/${item.mediaType}/${item.id}`}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  className="flex items-center gap-2 bg-white text-black font-bold px-5 py-3 rounded-full text-sm shadow-lg shadow-white/10"
                >
                  <Play size={16} fill="black" /> Play
                </motion.span>
              </Link>
              <Link href={detailsUrl(item.mediaType, item.id, item.title)}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.93 }}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-5 py-3 rounded-full text-sm"
                >
                  <Info size={16} /> Details
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* progress dots */}
        <div className="flex gap-1.5 mt-8">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Show featured item ${i + 1}`}
              className="relative h-1.5 rounded-full overflow-hidden bg-white/15"
              style={{ width: i === active ? 28 : 14, transition: "width .4s ease" }}
            >
              {i === active && (
                <motion.div
                  layoutId="hero-progress"
                  className="absolute inset-0 rainbow-underline"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
