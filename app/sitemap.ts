import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getTrending, getPopular, getTopRated } from "@/lib/tmdb";
import { getOTTPlatforms } from "@/lib/ott";

// Regenerate the sitemap alongside the same TMDB data cache used by the
// rest of the site, so it stays fresh without hammering the API.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/movies`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/tv-shows`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/anime`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ott`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/search`, changeFrequency: "monthly", priority: 0.5 },
  ];

  let contentRoutes: MetadataRoute.Sitemap = [];
  let ottRoutes: MetadataRoute.Sitemap = [];

  try {
    const [trending, popularMovies, popularTV, topRatedMovies, platforms] = await Promise.all([
      getTrending("all", "day"),
      getPopular("movie"),
      getPopular("tv"),
      getTopRated("movie"),
      getOTTPlatforms(),
    ]);

    const seen = new Set<string>();
    const items = [...trending, ...popularMovies, ...popularTV, ...topRatedMovies];

    contentRoutes = items.reduce<MetadataRoute.Sitemap>((acc, item) => {
      const key = `${item.mediaType}-${item.id}`;
      if (seen.has(key)) return acc;
      seen.add(key);
      acc.push({
        url: `${SITE_URL}/details/${item.mediaType}/${item.id}`,
        changeFrequency: "weekly",
        priority: 0.7,
      });
      return acc;
    }, []);

    ottRoutes = platforms.map((p) => ({
      url: `${SITE_URL}/ott/${p.slug}`,
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch {
    // If TMDB is unreachable at build/revalidate time, still ship the static routes.
  }

  return [...staticRoutes, ...contentRoutes, ...ottRoutes];
}
