const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

export type MediaType = "movie" | "tv";

async function tmdbFetch<T = any>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  revalidateSeconds = 3600
): Promise<T> {
  const url = new URL(BASE_URL + path);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
    next: { revalidate: revalidateSeconds },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`TMDB request failed (${res.status}) for ${path}: ${text}`);
  }
  return res.json();
}

// ---------- Image helpers ----------
export const img = {
  poster: (path?: string | null, size: "w185" | "w342" | "w500" | "w780" = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder-poster.svg",
  backdrop: (path?: string | null, size: "w780" | "w1280" | "original" = "w1280") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder-backdrop.svg",
  profile: (path?: string | null, size: "w185" | "h632" = "w185") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder-profile.svg",
};

// ---------- Normalized item shape used across the UI ----------
export interface ContentItem {
  id: number;
  mediaType: "movie" | "tv";
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  rating: number;
  releaseDate: string;
  genreIds: number[];
  popularity: number;
}

function normalize(raw: any, fallbackType?: MediaType): ContentItem {
  const mediaType: MediaType = (raw.media_type as MediaType) || fallbackType || "movie";
  return {
    id: raw.id,
    mediaType,
    title: raw.title || raw.name || "Untitled",
    overview: raw.overview || "",
    posterPath: raw.poster_path || null,
    backdropPath: raw.backdrop_path || null,
    rating: raw.vote_average || 0,
    releaseDate: raw.release_date || raw.first_air_date || "",
    genreIds: raw.genre_ids || [],
    popularity: raw.popularity || 0,
  };
}

// ---------- Trending / Discover ----------
export async function getTrending(mediaType: "all" | MediaType = "all", timeWindow: "day" | "week" = "day"): Promise<ContentItem[]> {
  const data = await tmdbFetch(`/trending/${mediaType}/${timeWindow}`, {}, 21600); // 6h cache
  return (data.results || []).map((r: any) => normalize(r));
}

export async function getPopular(mediaType: MediaType, page = 1): Promise<ContentItem[]> {
  const data = await tmdbFetch(`/${mediaType}/popular`, { page }, 21600);
  return (data.results || []).map((r: any) => normalize(r, mediaType));
}

export async function getTopRated(mediaType: MediaType, page = 1): Promise<ContentItem[]> {
  const data = await tmdbFetch(`/${mediaType}/top_rated`, { page }, 21600);
  return (data.results || []).map((r: any) => normalize(r, mediaType));
}

export async function getNowPlayingMovies(page = 1): Promise<ContentItem[]> {
  const data = await tmdbFetch(`/movie/now_playing`, { page }, 21600);
  return (data.results || []).map((r: any) => normalize(r, "movie"));
}

export async function getOnTheAirTV(page = 1): Promise<ContentItem[]> {
  const data = await tmdbFetch(`/tv/on_the_air`, { page }, 21600);
  return (data.results || []).map((r: any) => normalize(r, "tv"));
}

// Anime = animation genre (16) + Japanese origin, works for both movie & tv
export async function discoverAnime(mediaType: MediaType, page = 1, sortBy = "popularity.desc") {
  const path = mediaType === "movie" ? "/discover/movie" : "/discover/tv";
  const data = await tmdbFetch(
    path,
    {
      with_genres: 16,
      with_origin_country: "JP",
      sort_by: sortBy,
      page,
    },
    21600
  );
  return { results: (data.results || []).map((r: any) => normalize(r, mediaType)), totalPages: data.total_pages || 1 };
}

export async function discoverByGenre(mediaType: MediaType, page = 1, sortBy = "popularity.desc") {
  const path = mediaType === "movie" ? "/discover/movie" : "/discover/tv";
  const data = await tmdbFetch(path, { sort_by: sortBy, page }, 21600);
  return { results: (data.results || []).map((r: any) => normalize(r, mediaType)), totalPages: data.total_pages || 1 };
}

export async function getMoviesPage(page = 1, sortBy = "popularity.desc") {
  const data = await tmdbFetch("/discover/movie", { page, sort_by: sortBy }, 21600);
  return { results: (data.results || []).map((r: any) => normalize(r, "movie")), totalPages: data.total_pages || 1 };
}

export async function getTVPage(page = 1, sortBy = "popularity.desc") {
  const data = await tmdbFetch("/discover/tv", { page, sort_by: sortBy }, 21600);
  return { results: (data.results || []).map((r: any) => normalize(r, "tv")), totalPages: data.total_pages || 1 };
}

// ---------- Watch providers (OTT platforms) ----------
export interface RawWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority?: number;
}

// Full catalog of providers TMDB knows about for a given region. Cached for
// a day since the provider catalog barely changes.
export async function getWatchProviderCatalog(
  mediaType: MediaType,
  region = "IN"
): Promise<RawWatchProvider[]> {
  const data = await tmdbFetch(`/watch/providers/${mediaType}`, { watch_region: region }, 86400);
  return data.results || [];
}

// Discover titles available (stream/rent/buy) on a specific provider.
export async function discoverByProvider(
  mediaType: MediaType,
  providerId: number,
  opts: { page?: number; sortBy?: string; region?: string } = {}
) {
  const { page = 1, sortBy = "popularity.desc", region = "IN" } = opts;
  const path = mediaType === "movie" ? "/discover/movie" : "/discover/tv";
  const params: Record<string, string | number> = {
    with_watch_providers: providerId,
    watch_region: region,
    sort_by: sortBy,
    page,
  };
  // Quality floor so obscure/low-vote titles don't flood "Top Rated" for a provider
  if (sortBy === "vote_average.desc") {
    params["vote_count.gte"] = 50;
  }
  const data = await tmdbFetch(path, params, 10800);
  return { results: (data.results || []).map((r: any) => normalize(r, mediaType)), totalPages: data.total_pages || 1 };
}

// Where a specific title can be watched, for a given region.
export async function getTitleWatchProviders(mediaType: MediaType, id: number | string, region = "IN") {
  const data = await tmdbFetch(`/${mediaType}/${id}/watch/providers`, {}, 21600);
  return data.results?.[region] || null;
}

// ---------- Search ----------
export async function searchMulti(query: string, page = 1) {
  if (!query.trim()) return { results: [], totalPages: 0 };
  const data = await tmdbFetch("/search/multi", { query, page, include_adult: "false" }, 60);
  const results = (data.results || [])
    .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
    .map((r: any) => normalize(r));
  return { results, totalPages: data.total_pages || 1 };
}

// ---------- Details ----------
export async function getDetails(mediaType: MediaType, id: string | number) {
  const data = await tmdbFetch(
    `/${mediaType}/${id}`,
    { append_to_response: "credits,recommendations,videos,external_ids" },
    3600
  );
  return data;
}

export async function getSeasonDetails(tvId: string | number, seasonNumber: number) {
  const data = await tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`, {}, 3600);
  return data;
}

// ---------- Genres (for labels) ----------
export async function getGenreMap(mediaType: MediaType) {
  const data = await tmdbFetch(`/genre/${mediaType}/list`, {}, 86400);
  const map: Record<number, string> = {};
  (data.genres || []).forEach((g: any) => (map[g.id] = g.name));
  return map;
}
