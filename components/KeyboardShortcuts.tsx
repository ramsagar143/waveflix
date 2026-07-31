"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// h/H -> Home, m/M -> Movies, t/T -> TV Shows, a/A -> Anime, s/S -> Search
const SHORTCUT_ROUTES: Record<string, string> = {
  h: "/",
  m: "/movies",
  t: "/tv-shows",
  a: "/anime",
  s: "/search",
};

export default function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack keys while the user is typing in a field, or while
      // using a browser/OS modifier combo (Ctrl/Cmd/Alt+letter).
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      const isTyping =
        tag === "INPUT" || tag === "TEXTAREA" || !!target?.isContentEditable;

      if (isTyping || e.ctrlKey || e.metaKey || e.altKey) return;

      const route = SHORTCUT_ROUTES[e.key.toLowerCase()];
      if (route) {
        e.preventDefault();
        router.push(route);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
