"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Server } from "lucide-react";
import { SERVERS, DEFAULT_SERVER_ID } from "@/lib/servers";

export default function VideoPlayer({
  title,
  mediaType,
  tmdbId,
  season,
  episode,
}: {
  title: string;
  mediaType: "movie" | "tv";
  tmdbId: number;
  season?: number;
  episode?: number;
}) {
  const [serverId, setServerId] = useState(DEFAULT_SERVER_ID);
  // Bumping this key forces the iframe to remount (reload) on server switch
  // or when the season/episode changes, instead of silently staying stuck
  // on the old source.
  const [reloadKey, setReloadKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerWrapRef = useRef<HTMLDivElement>(null);

  const activeServer = SERVERS.find((s) => s.id === serverId) || SERVERS[0];
  const embedUrl = activeServer.embedUrl({ mediaType, tmdbId, season, episode });

  const toggleFullscreen = () => {
    const el = playerWrapRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerWrapRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    // F / f -> toggle the player fullscreen, unless the user is typing somewhere
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || !!target?.isContentEditable;
      if (isTyping || e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div
        ref={playerWrapRef}
        className={`relative w-full bg-base-700 card-glow overflow-hidden ${
          isFullscreen ? "h-screen rounded-none" : "aspect-video rounded-2xl"
        }`}
      >
        <iframe
          key={`${serverId}-${season}-${episode}-${reloadKey}`}
          src={embedUrl}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full border-0"
          title={title}
        />
      </div>

      {/* Server selector */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-white/40 mr-1">
          <Server size={13} /> Server:
        </span>
        {SERVERS.map((s) => {
          const active = s.id === serverId;
          return (
            <motion.button
              key={s.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => {
                if (active) {
                  // same server tapped again -> reload it (handy if it failed to load)
                  setReloadKey((k) => k + 1);
                } else {
                  setServerId(s.id);
                }
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold border transition-colors ${
                active
                  ? "text-white border-transparent"
                  : "text-white/50 border-white/10 hover:text-white hover:border-white/25"
              }`}
              style={
                active
                  ? { background: "linear-gradient(120deg, #ff3ea5, #4f7dff, #8b5cf6)" }
                  : {}
              }
            >
              {s.name}
            </motion.button>
          );
        })}
      </div>

      <p className="mt-2 flex items-start gap-1.5 text-[11px] text-white/30">
        <AlertTriangle size={12} className="mt-0.5 shrink-0" />
        If a server doesn&apos;t load, try tapping it again or switch to another server above.
      </p>
    </div>
  );
}
