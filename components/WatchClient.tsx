"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock, Loader2, Star } from "lucide-react";
import { img } from "@/lib/tmdb";
import { formatRuntime } from "@/lib/utils";
import { useDragScroll } from "@/lib/useDragScroll";
import VideoPlayer from "./VideoPlayer";
import { openSmartlink } from "@/lib/ads";

interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
}

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
}

export default function WatchClient({
  mediaType,
  tmdbId,
  title,
  posterPath,
  seasons,
}: {
  mediaType: "movie" | "tv";
  tmdbId: number;
  title: string;
  posterPath: string | null;
  seasons?: Season[];
}) {
  const validSeasons = (seasons || []).filter((s) => s.season_number > 0);
  const [activeSeason, setActiveSeason] = useState<number>(validSeasons[0]?.season_number || 1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState<number>(1);
  const { ref: seasonsRef, grabbing: seasonsGrabbing, dragHandlers: seasonsDragHandlers, dragStyle: seasonsDragStyle } =
    useDragScroll<HTMLDivElement>();

  useEffect(() => {
    if (mediaType !== "tv") return;
    setLoadingEpisodes(true);
    fetch(`/api/season?tvId=${tmdbId}&season=${activeSeason}`)
      .then((r) => r.json())
      .then((data) => {
        setEpisodes(data.episodes || []);
        setActiveEpisode(data.episodes?.[0]?.episode_number || 1);
      })
      .finally(() => setLoadingEpisodes(false));
  }, [activeSeason, mediaType, tmdbId]);

  return (
    <div className="px-4 md:px-8 pt-6 pb-16">
      <Link
        href={`/details/${mediaType}/${tmdbId}`}
        className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-5 transition-colors"
      >
        <ChevronLeft size={16} /> Back to details
      </Link>

      <VideoPlayer
        title={title}
        mediaType={mediaType}
        tmdbId={tmdbId}
        season={mediaType === "tv" ? activeSeason : undefined}
        episode={mediaType === "tv" ? activeEpisode : undefined}
      />

      <h1 className="font-display font-bold text-xl md:text-2xl text-white mt-5">
        {title}
      </h1>

      {mediaType === "tv" && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-5 rounded-full bg-neon-cyan" />
            <h2 className="font-display font-bold text-lg md:text-xl text-white">
              Seasons &amp; Episodes
            </h2>
          </div>

          <div
            ref={seasonsRef}
            {...seasonsDragHandlers}
            className={`flex gap-2 overflow-x-auto overflow-y-hidden no-scrollbar pt-1 pb-2 mb-5 md:cursor-grab ${
              seasonsGrabbing ? "dragging md:cursor-grabbing" : ""
            }`}
            style={seasonsDragStyle}
          >
            {validSeasons.map((s) => (
              <motion.button
                key={s.id}
                whileTap={{ scale: 0.92 }}
                onClick={() => setActiveSeason(s.season_number)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-bold border transition-colors ${
                  activeSeason === s.season_number
                    ? "text-white border-transparent"
                    : "text-white/50 border-white/10 hover:text-white hover:border-white/25"
                }`}
                style={
                  activeSeason === s.season_number
                    ? {
                        background:
                          "linear-gradient(120deg, #ff3ea5, #4f7dff, #8b5cf6)",
                      }
                    : {}
                }
              >
                {s.name}
              </motion.button>
            ))}
          </div>

          {loadingEpisodes ? (
            <div className="flex items-center gap-2 text-white/50 text-sm py-8">
              <Loader2 size={18} className="animate-spin text-neon-cyan" />
              Loading episodes...
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {episodes.map((ep, i) => (
                  <motion.button
                    key={ep.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                    onClick={() => { openSmartlink(); setActiveEpisode(ep.episode_number); }}
                    className={`text-left flex gap-3 p-2.5 rounded-2xl border transition-colors ${
                      activeEpisode === ep.episode_number
                        ? "border-neon-cyan/50 bg-white/[0.06]"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15"
                    }`}
                  >
                    <div className="relative w-[110px] h-[68px] shrink-0 rounded-xl overflow-hidden bg-base-700">
                      <SafeImage
                        src={img.backdrop(ep.still_path || posterPath, "w780")}
                        fallbackSrc="/placeholder-backdrop.svg"
                        alt={ep.name}
                        fill
                        sizes="110px"
                        className="object-cover"
                      />
                      {activeEpisode === ep.episode_number && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <span className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                            <span className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[8px] border-l-black ml-0.5" />
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold text-white/85">
                          {ep.episode_number}. {ep.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-white/40 mt-1">
                        {ep.runtime && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {formatRuntime(ep.runtime)}
                          </span>
                        )}
                        {!!ep.vote_average && (
                          <span className="flex items-center gap-1 text-neon-yellow">
                            <Star size={10} fill="currentColor" strokeWidth={0} />
                            {ep.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-white/40 line-clamp-2 mt-1">
                        {ep.overview || "No description available."}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
