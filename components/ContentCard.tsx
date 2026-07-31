"use client";

import SafeImage from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ContentItem, img } from "@/lib/tmdb";
import { openSmartlink } from "@/lib/ads";

export default function ContentCard({
  item,
  index = 0,
  size = "md",
  fluid = false,
}: {
  item: ContentItem;
  index?: number;
  size?: "sm" | "md" | "lg";
  fluid?: boolean;
}) {
  const router = useRouter();

  const widths: Record<string, string> = {
    sm: "w-[104px] md:w-[128px]",
    md: "w-[122px] md:w-[152px]",
    lg: "w-[140px] md:w-[176px]",
  };

  const handleClick = () => {
    // Smartlink background mein khulega, content page current tab mein
    openSmartlink();
    router.push(`/details/${item.mediaType}/${item.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={fluid ? "w-full" : `shrink-0 ${widths[size]}`}
    >
      <div onClick={handleClick} className="block group cursor-pointer">
        <motion.div
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="card-glow card-hover rounded-[18px] overflow-hidden bg-base-700 relative"
        >
          <div className="relative aspect-[2/3] overflow-hidden rounded-[16px]">
            <SafeImage
              src={img.poster(item.posterPath, "w500")}
              fallbackSrc="/placeholder-poster.svg"
              alt={item.title}
              fill
              sizes={
                fluid
                  ? "(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 16vw"
                  : "(max-width: 768px) 150px, 190px"
              }
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-2 py-1 text-[11px] font-bold text-neon-yellow border border-white/10">
              <Star size={11} fill="currentColor" strokeWidth={0} />
              {item.rating ? item.rating.toFixed(1) : "N/A"}
            </div>

            <span className="absolute top-2 left-2 text-[9px] font-bold tracking-wider uppercase px-2 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/80 border border-white/10">
              {item.mediaType === "tv" ? "Series" : "Movie"}
            </span>
          </div>
        </motion.div>
        <p className="mt-2 text-[13px] md:text-sm font-semibold text-white/90 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-pink group-hover:to-neon-blue transition-all">
          {item.title}
        </p>
        <p className="text-[11px] text-white/40">
          {item.releaseDate ? item.releaseDate.slice(0, 4) : "TBA"}
        </p>
      </div>
    </motion.div>
  );
}
