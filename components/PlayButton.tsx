"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Play, ListVideo } from "lucide-react";
import { openSmartlink } from "@/lib/ads";

export default function PlayButton({
  mediaType,
  id,
}: {
  mediaType: "movie" | "tv";
  id: number;
}) {
  const router = useRouter();

  const handleClick = () => {
    openSmartlink();
    router.push(`/watch/${mediaType}/${id}`);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      className="relative inline-flex items-center gap-2 font-bold px-6 py-3.5 rounded-full text-sm text-white overflow-hidden"
      style={{
        background: "linear-gradient(120deg, #ff3ea5, #ff8a3d, #ffd23d, #3ddc84, #22e2d6, #4f7dff, #8b5cf6, #ff3ea5)",
        backgroundSize: "300% 100%",
      }}
    >
      <motion.span
        className="absolute inset-0"
        animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          background: "linear-gradient(120deg, #ff3ea5, #ff8a3d, #ffd23d, #3ddc84, #22e2d6, #4f7dff, #8b5cf6, #ff3ea5)",
          backgroundSize: "300% 100%",
        }}
      />
      <span className="relative z-10 flex items-center gap-2">
        {mediaType === "tv" ? <ListVideo size={17} /> : <Play size={17} fill="white" />}
        {mediaType === "tv" ? "Watch Episodes" : "Play Now"}
      </span>
    </motion.button>
  );
}
