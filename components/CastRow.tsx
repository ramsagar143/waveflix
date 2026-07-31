"use client";

import SafeImage from "@/components/SafeImage";
import { motion } from "framer-motion";
import { img } from "@/lib/tmdb";
import { useDragScroll } from "@/lib/useDragScroll";

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export default function CastRow({ cast }: { cast: CastMember[] }) {
  const { ref: scrollerRef, grabbing, dragHandlers, dragStyle } = useDragScroll<HTMLDivElement>();

  if (!cast?.length) return null;
  return (
    <section className="py-6 md:py-8">
      <div className="flex items-center gap-2 mb-4 px-4 md:px-8">
        <span className="w-1.5 h-5 rounded-full bg-neon-violet" />
        <h2 className="font-display font-bold text-lg md:text-2xl text-white">Cast</h2>
      </div>
      <div
        ref={scrollerRef}
        {...dragHandlers}
        className={`flex gap-4 overflow-x-auto overflow-y-hidden no-scrollbar px-4 md:px-8 pt-2 pb-2 md:cursor-grab ${
          grabbing ? "dragging md:cursor-grabbing" : ""
        }`}
        style={dragStyle}
      >
        {cast.slice(0, 16).map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.25) }}
            className="shrink-0 w-[86px] md:w-[100px] text-center"
          >
            <div className="relative w-[72px] h-[72px] md:w-[88px] md:h-[88px] mx-auto rounded-full overflow-hidden card-glow card-hover">
              <SafeImage
                src={img.profile(member.profile_path, "w185")}
                fallbackSrc="/placeholder-profile.svg"
                alt={member.name}
                fill
                sizes="88px"
                draggable={false}
                className="object-cover rounded-full"
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-white/90 line-clamp-1">
              {member.name}
            </p>
            <p className="text-[10px] text-white/40 line-clamp-1">{member.character}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
