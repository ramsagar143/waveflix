"use client";

import { useEffect, useState, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, Loader2, TrendingUp } from "lucide-react";
import { ContentItem } from "@/lib/tmdb";
import ContentCard from "./ContentCard";
import BannerAd from "./BannerAd";

const SUGGESTIONS = [
  "Dune", "Attack on Titan", "Breaking Bad", "Spider-Man", "One Piece",
  "The Last of Us", "Demon Slayer", "Oppenheimer",
];

export default function SearchClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const runSearch = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  return (
    <div className="px-4 md:px-8 pt-6 md:pt-10 pb-16">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display font-extrabold text-3xl md:text-5xl text-white mb-6 text-rainbow"
      >
        Search
      </motion.h1>

      <form onSubmit={onSubmit} className="relative max-w-2xl mb-8">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          ref={inputRef}
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows, anime..."
          className="w-full bg-white/5 border-2 border-white/10 focus:border-transparent rounded-2xl py-4 pl-12 pr-12 text-white text-base placeholder:text-white/35 focus:outline-none transition-colors card-glow"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setSearched(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </form>

      {!searched && (
        <div>
          <div className="flex items-center gap-2 text-white/50 text-sm font-semibold mb-3">
            <TrendingUp size={15} /> Popular searches
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <motion.button
                key={s}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  setQuery(s);
                  runSearch(s);
                }}
                className="px-4 py-2 rounded-full text-sm font-medium text-white/70 bg-white/5 border border-white/10 hover:text-white hover:border-white/25 transition-colors"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-white/50 text-sm mt-10">
          <Loader2 size={18} className="animate-spin text-neon-cyan" />
          Searching TMDB...
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/40 text-sm mt-10"
        >
          No results for &ldquo;{query}&rdquo;. Try a different title.
        </motion.p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 mt-2">
        <AnimatePresence>
          {results.map((item, i) => (
            <motion.div
              key={`${item.mediaType}-${item.id}`}
              initial={{ opacity: 0, y: 60, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{
                duration: 0.5,
                delay: Math.min(i * 0.05, 0.6),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ContentCard item={item} index={i} size="lg" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom banner ad */}
      {results.length > 0 && <BannerAd />}
    </div>
  );
}
