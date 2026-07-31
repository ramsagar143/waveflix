"use client";

import { useState, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import { ContentItem } from "@/lib/tmdb";
import ContentCard from "./ContentCard";

export default function OTTSearch({ slug, platformName }: { slug: string; platformName: string }) {
  const [query, setQuery] = useState("");
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
      const res = await fetch(`/api/ott-search?slug=${slug}&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    inputRef.current?.focus();
  };

  return (
    <div className="px-4 md:px-8 mb-6">
      <form onSubmit={onSubmit} className="relative max-w-xl">
        <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search on ${platformName}...`}
          className="w-full bg-white/5 border-2 border-white/10 focus:border-transparent rounded-2xl py-3 pl-11 pr-11 text-white text-sm placeholder:text-white/35 focus:outline-none transition-colors card-glow"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
          >
            <X size={17} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {loading ? (
              <div className="flex items-center gap-2 text-white/50 text-sm mt-6">
                <Loader2 size={18} className="animate-spin text-neon-cyan" />
                Searching {platformName}...
              </div>
            ) : results.length === 0 ? (
              <p className="text-white/40 text-sm mt-6">
                Nothing on {platformName} matches &ldquo;{query}&rdquo;.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5 mt-6">
                {results.map((item, i) => (
                  <ContentCard key={`${item.mediaType}-${item.id}`} item={item} index={i} size="lg" fluid />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
