"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import BannerAd from "@/components/BannerAd";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-32">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6"
      >
        <Compass size={28} className="text-neon-cyan" />
      </motion.div>
      <h1 className="font-display font-extrabold text-3xl md:text-4xl text-rainbow mb-3">
        Lost in the void
      </h1>
      <p className="text-white/50 text-sm md:text-base max-w-sm mb-8">
        We couldn&apos;t find that page. It may have been moved or never existed.
      </p>
      <Link href="/">
        <motion.span
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className="inline-block bg-white text-black font-bold px-6 py-3 rounded-full text-sm"
        >
          Back to Home
        </motion.span>
      </Link>

      {/* Ad */}
      <div className="mt-10">
        <BannerAd />
      </div>
    </div>
  );
}
