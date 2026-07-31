"use client";

import { motion } from "framer-motion";

interface TelegramButtonProps {
  url?: string;
  text?: string;
}

export default function TelegramButton({
  url = process.env.NEXT_PUBLIC_TELEGRAM_LINK || "https://t.me/viewverseofficial",
  text = "Join",
}: TelegramButtonProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Join our Telegram Channel"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#0088cc] via-[#0099e6] to-[#229ed9] text-white shadow-lg shadow-[#0088cc]/35 hover:shadow-xl hover:shadow-[#0088cc]/55 border border-white/20 backdrop-blur-md transition-all duration-300 group"
    >
      {/* Pulse ring animation */}
      <span className="absolute -inset-0.5 rounded-full bg-[#0088cc] opacity-40 blur-sm group-hover:opacity-75 transition-opacity duration-300 -z-10 animate-pulse" />

      {/* Telegram SVG Icon */}
      <div className="relative flex items-center justify-center">
        <svg
          className="w-5 h-5 text-white fill-current transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
          viewBox="0 0 24 24"
        >
          <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.752-.17.706-.433.943-.684.966-.547.05-0.962-.361-1.492-.708-.83-.544-1.3-.881-2.106-1.412-.931-.613-.327-.95.203-1.501.139-.144 2.548-2.336 2.595-2.536.006-.025.012-.119-.044-.169s-.136-.033-.195-.02c-.084.019-1.423.905-4.017 2.657-.38.26-.723.388-1.03.381-.338-.008-.988-.191-1.472-.349-.593-.193-1.063-.295-1.022-.623.021-.171.258-.346.711-.525 2.783-1.213 4.639-2.013 5.567-2.4 2.648-1.106 3.197-1.3 3.555-1.306.079 0 .256.018.371.111.097.079.124.186.134.262.01.077.022.251.012.39z" />
        </svg>
      </div>

      {/* Text Label */}
      <div className="flex items-center gap-1">
        <span className="font-display font-extrabold text-xs md:text-sm tracking-wide uppercase">
          {text}
        </span>
        <span className="hidden sm:inline-block font-display font-extrabold text-xs md:text-sm tracking-wide uppercase opacity-90">
          Telegram
        </span>
      </div>
    </motion.a>
  );
}
