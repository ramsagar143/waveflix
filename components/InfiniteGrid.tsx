"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ContentItem } from "@/lib/tmdb";
import ContentCard from "./ContentCard";
import BannerAd from "./BannerAd";
import InFeedAd from "./InFeedAd";
import { Loader2 } from "lucide-react";

// Cards per grid "chunk" — an InFeedAd is rendered as its own full-width
// row between chunks. Keeping the ad OUTSIDE the CSS grid (rather than
// spanning it with grid-column: 1/-1) means it always gets real, honest
// full-container width to center itself in — no auto-fill/dense edge
// cases to fight, and it behaves identically to the home page's ad rows.
const CHUNK_SIZE = 12;

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function InfiniteGrid({
  mediaType,
  category,
  initialItems,
  initialPage = 1,
  animeSort,
  provider,
}: {
  mediaType: "movie" | "tv";
  category: string;
  initialItems: ContentItem[];
  initialPage?: number;
  animeSort?: string;
  /** TMDB watch-provider id — when set, results are restricted to that OTT platform */
  provider?: number;
}) {
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef(new Set(initialItems.map((i) => `${i.mediaType}-${i.id}`)));

  // reset when category/mediaType/provider changes
  useEffect(() => {
    setItems(initialItems);
    setPage(initialPage);
    setDone(false);
    seenIds.current = new Set(initialItems.map((i) => `${i.mediaType}-${i.id}`));
  }, [category, mediaType, animeSort, provider]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (loading || done) return;
    setLoading(true);
    const nextPage = page + 1;
    try {
      const extra = animeSort ? `&animeSort=${animeSort}` : "";
      const providerParam = provider ? `&provider=${provider}` : "";
      const res = await fetch(
        `/api/discover?mediaType=${mediaType}&category=${category}&page=${nextPage}${extra}${providerParam}`
      );
      const data = await res.json();
      const fresh: ContentItem[] = (data.results || []).filter(
        (i: ContentItem) => !seenIds.current.has(`${i.mediaType}-${i.id}`)
      );
      fresh.forEach((i) => seenIds.current.add(`${i.mediaType}-${i.id}`));

      if (!fresh.length || nextPage >= (data.totalPages || 500) || nextPage > 200) {
        setDone(fresh.length === 0);
      }
      setItems((prev) => [...prev, ...fresh]);
      setPage(nextPage);
    } catch (e) {
      // silent fail — sentinel stays, user can scroll to retry
    } finally {
      setLoading(false);
    }
  }, [loading, done, page, mediaType, category, provider]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "600px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const chunks = chunk(items, CHUNK_SIZE);

  return (
    <div>
      {chunks.map((group, chunkIndex) => {
        const baseIndex = chunkIndex * CHUNK_SIZE;
        return (
          <div key={`chunk-${chunkIndex}`}>
            <div
              className="grid grid-flow-row-dense gap-4 md:gap-5 px-4 md:px-8"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
            >
              {group.map((item, j) => {
                const i = baseIndex + j;
                return (
                  <motion.div
                    key={`${item.mediaType}-${item.id}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.4, delay: (i % 12) * 0.03 }}
                  >
                    <ContentCard item={item} index={i} size="lg" fluid />
                  </motion.div>
                );
              })}
            </div>

            {/* Ad — its own full-width row between chunks, exactly like
               the home page. Rendered outside the grid so it always gets
               genuine full container width to center itself in. */}
            {chunkIndex < chunks.length - 1 && <InFeedAd />}
          </div>
        );
      })}

      <div ref={sentinelRef} className="flex items-center justify-center py-10">
        {loading && (
          <div className="flex items-center gap-2 text-white/50 text-sm">
            <Loader2 size={18} className="animate-spin text-neon-cyan" />
            Loading more...
          </div>
        )}
        {done && items.length > 0 && (
          <p className="text-white/30 text-sm">You&apos;ve reached the end ✨</p>
        )}
        {!loading && items.length === 0 && (
          <p className="text-white/40 text-sm">Nothing found here yet.</p>
        )}
      </div>

      {/* Bottom banner ad — sits below the grid, always the last thing on
         the page since newly loaded items get appended above it. */}
      {items.length > 0 && <BannerAd />}
    </div>
  );
}
