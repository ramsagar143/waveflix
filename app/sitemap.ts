import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getOTTPlatforms } from "@/lib/ott";

export const revalidate = 86400; // Cache sitemap for 24 hours

const TMDB_BASE = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

function slugify(text: string) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isValidDate(dateStr: any) {
  if (!dateStr || typeof dateStr !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim());
}

function formatDate(dateStr: any, fallbackDate: string) {
  if (isValidDate(dateStr)) {
    const trimmed = dateStr.trim();
    if (trimmed <= fallbackDate) return trimmed;
  }
  return fallbackDate;
}

async function tmdbFetch(endpoint: string, params: Record<string, string | number> = {}) {
  const url = new URL(TMDB_BASE + endpoint);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.set(key, String(val));
    }
  });

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) return { results: [] };
    return res.json();
  } catch {
    return { results: [] };
  }
}

async function fetchPages(
  endpoint: string,
  startPage: number,
  endPage: number,
  extraParams: Record<string, string | number> = {}
) {
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  const batchSize = 15;
  const results: any[] = [];

  for (let i = 0; i < pages.length; i += batchSize) {
    const chunk = pages.slice(i, i + batchSize);
    const chunkRes = await Promise.allSettled(
      chunk.map((page) =>
        tmdbFetch(endpoint, { ...extraParams, page, sort_by: "popularity.desc" })
      )
    );
    chunkRes.forEach((res) => {
      if (res.status === "fulfilled" && res.value?.results) {
        results.push(...res.value.results);
      }
    });
  }
  return results;
}

export async function generateSitemaps() {
  return [
    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
  ];
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const today = new Date().toISOString().split("T")[0];

  if (id === 0) {
    const staticRoutes: MetadataRoute.Sitemap = [
      { url: `${SITE_URL}/`, lastModified: today },
      { url: `${SITE_URL}/movies`, lastModified: today },
      { url: `${SITE_URL}/tv-shows`, lastModified: today },
      { url: `${SITE_URL}/anime`, lastModified: today },
      { url: `${SITE_URL}/ott`, lastModified: today },
      { url: `${SITE_URL}/search`, lastModified: today },
    ];

    let ottRoutes: MetadataRoute.Sitemap = [];
    try {
      const platforms = await getOTTPlatforms();
      ottRoutes = platforms.map((p) => ({
        url: `${SITE_URL}/ott/${p.slug}`,
        lastModified: today,
      }));
    } catch {}

    const searchQueries = [
      "action", "comedy", "drama", "horror", "romance", "sci-fi", "thriller",
      "adventure", "animation", "crime", "documentary", "family", "fantasy",
      "history", "mystery", "war", "western", "k-drama", "anime", "bollywood",
      "hollywood", "hindi-dubbed", "south-indian", "marvel", "dc", "netflix-series",
      "trending", "popular", "2026-movies", "top-rated"
    ];

    const searchRoutes: MetadataRoute.Sitemap = searchQueries.map((q) => ({
      url: `${SITE_URL}/search?q=${encodeURIComponent(q)}`,
      lastModified: today,
    }));

    return [...staticRoutes, ...ottRoutes, ...searchRoutes];
  }

  if (id === 1) {
    const movies = await fetchPages("/discover/movie", 1, 100);
    const seen = new Set<number>();
    return movies.reduce<MetadataRoute.Sitemap>((acc, m) => {
      if (!m.id || seen.has(m.id)) return acc;
      seen.add(m.id);
      const slug = slugify(m.title || m.original_title);
      const path = slug ? `${m.id}-${slug}` : String(m.id);
      acc.push({
        url: `${SITE_URL}/details/movie/${path}`,
        lastModified: formatDate(m.release_date, today),
      });
      return acc;
    }, []);
  }

  if (id === 2) {
    const movies = await fetchPages("/discover/movie", 101, 200);
    const seen = new Set<number>();
    return movies.reduce<MetadataRoute.Sitemap>((acc, m) => {
      if (!m.id || seen.has(m.id)) return acc;
      seen.add(m.id);
      const slug = slugify(m.title || m.original_title);
      const path = slug ? `${m.id}-${slug}` : String(m.id);
      acc.push({
        url: `${SITE_URL}/details/movie/${path}`,
        lastModified: formatDate(m.release_date, today),
      });
      return acc;
    }, []);
  }

  if (id === 3) {
    const tvs = await fetchPages("/discover/tv", 1, 100);
    const seen = new Set<number>();
    return tvs.reduce<MetadataRoute.Sitemap>((acc, t) => {
      if (!t.id || seen.has(t.id)) return acc;
      seen.add(t.id);
      const slug = slugify(t.name || t.original_name);
      const path = slug ? `${t.id}-${slug}` : String(t.id);
      acc.push({
        url: `${SITE_URL}/details/tv/${path}`,
        lastModified: formatDate(t.first_air_date, today),
      });
      return acc;
    }, []);
  }

  if (id === 4) {
    const tvs = await fetchPages("/discover/tv", 101, 200);
    const seen = new Set<number>();
    return tvs.reduce<MetadataRoute.Sitemap>((acc, t) => {
      if (!t.id || seen.has(t.id)) return acc;
      seen.add(t.id);
      const slug = slugify(t.name || t.original_name);
      const path = slug ? `${t.id}-${slug}` : String(t.id);
      acc.push({
        url: `${SITE_URL}/details/tv/${path}`,
        lastModified: formatDate(t.first_air_date, today),
      });
      return acc;
    }, []);
  }

  if (id === 5) {
    const [animeTv, animeMovies] = await Promise.all([
      fetchPages("/discover/tv", 1, 40, { with_genres: 16, with_origin_country: "JP" }),
      fetchPages("/discover/movie", 1, 30, { with_genres: 16, with_origin_country: "JP" }),
    ]);

    const seen = new Set<string>();
    const animeRoutes: MetadataRoute.Sitemap = [];

    animeTv.forEach((t) => {
      const key = `tv-${t.id}`;
      if (!t.id || seen.has(key)) return;
      seen.add(key);
      const slug = slugify(t.name || t.original_name);
      const path = slug ? `${t.id}-${slug}` : String(t.id);
      animeRoutes.push({
        url: `${SITE_URL}/details/tv/${path}`,
        lastModified: formatDate(t.first_air_date, today),
      });
    });

    animeMovies.forEach((m) => {
      const key = `movie-${m.id}`;
      if (!m.id || seen.has(key)) return;
      seen.add(key);
      const slug = slugify(m.title || m.original_title);
      const path = slug ? `${m.id}-${slug}` : String(m.id);
      animeRoutes.push({
        url: `${SITE_URL}/details/movie/${path}`,
        lastModified: formatDate(m.release_date, today),
      });
    });

    return animeRoutes;
  }

  return [];
}
