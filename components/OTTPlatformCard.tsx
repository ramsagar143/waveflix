"use client";

import SafeImage from "@/components/SafeImage";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { OTTPlatform, OTT_LOGO_URL } from "@/lib/ott";
import { openSmartlink } from "@/lib/ads";

export default function OTTPlatformCard({
  platform,
  size = "row",
  index = 0,
}: {
  platform: OTTPlatform;
  size?: "row" | "grid";
  index?: number;
}) {
  const router = useRouter();
  const dims = size === "grid" ? "w-full aspect-square" : "w-[104px] h-[104px] md:w-[128px] md:h-[128px]";

  const handleClick = () => {
    openSmartlink();
    router.push(`/ott/${platform.slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className={size === "grid" ? "w-full" : "shrink-0"}
    >
      <div onClick={handleClick} className="block group cursor-pointer">
        <motion.div
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.04 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className={`ott-glow rounded-[20px] overflow-hidden bg-base-700 relative flex items-center justify-center ${dims}`}
          style={{
            background: `radial-gradient(circle at 50% 30%, ${platform.color}26, #14141f 75%)`,
          }}
        >
          <div className="relative w-[62%] h-[62%]">
            <SafeImage
              src={OTT_LOGO_URL(platform.logoPath)}
              fallbackSrc="/placeholder-poster.svg"
              alt={platform.name}
              fill
              sizes={size === "grid" ? "160px" : "128px"}
              className="object-contain drop-shadow-lg"
            />
          </div>
        </motion.div>
        <p className="mt-2 text-center text-[12px] md:text-sm font-semibold text-white/85 line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-neon-pink group-hover:to-neon-blue transition-all">
          {platform.name}
        </p>
      </div>
    </motion.div>
  );
}
