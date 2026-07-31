import { NextRequest, NextResponse } from "next/server";
import {
  getPopular,
  getTopRated,
  getNowPlayingMovies,
  getOnTheAirTV,
  discoverAnime,
  getMoviesPage,
  getTVPage,
  getTrending,
  discoverByProvider,
} from "@/lib/tmdb";

// Same shape of data is requested repeatedly (infinite-scroll pagination,
// same category, across many visitors) — letting the CDN/browser cache each
// response means only the very first request per page/category actually
// waits on TMDB; every one after that is served instantly.
const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mediaType = (searchParams.get("mediaType") || "movie") as "movie" | "tv";
  const category = searchParams.get("category") || "popular";
  const page = Number(searchParams.get("page") || "1");
  const provider = searchParams.get("provider");

  try {
    let results: any[] = [];
    let totalPages = 1;

    if (provider) {
      const providerId = Number(provider);
      const sortMap: Record<string, string> = {
        popular: "popularity.desc",
        trending: "popularity.desc",
        top_rated: "vote_average.desc",
        now_playing: mediaType === "movie" ? "primary_release_date.desc" : "first_air_date.desc",
      };
      const d = await discoverByProvider(mediaType, providerId, {
        page,
        sortBy: sortMap[category] || "popularity.desc",
      });
      results = d.results;
      totalPages = d.totalPages;
      return NextResponse.json({ results, page, totalPages }, { headers: CACHE_HEADERS });
    }

    switch (category) {
      case "top_rated":
        results = await getTopRated(mediaType, page);
        totalPages = 500;
        break;
      case "now_playing":
        results = mediaType === "movie" ? await getNowPlayingMovies(page) : await getOnTheAirTV(page);
        totalPages = 500;
        break;
      case "on_the_air":
        results = await getOnTheAirTV(page);
        totalPages = 500;
        break;
      case "trending": {
        // trending endpoint has only ~1 page of "day" data with real variety,
        // so blend with popularity-sorted discover for further pages
        if (page === 1) {
          results = (await getTrending("all", "day")).filter((r) =>
            mediaType ? r.mediaType === mediaType : true
          );
        } else {
          const d = mediaType === "movie" ? await getMoviesPage(page) : await getTVPage(page);
          results = d.results;
          totalPages = d.totalPages;
        }
        break;
      }
      case "anime": {
        const sortParam = searchParams.get("animeSort");
        const sortMap: Record<string, string> = {
          popular: "popularity.desc",
          top_rated: "vote_average.desc",
          now_playing: "first_air_date.desc",
          trending: "popularity.desc",
        };
        const d = await discoverAnime(mediaType, page, sortMap[sortParam || "popular"] || "popularity.desc");
        results = d.results;
        totalPages = d.totalPages;
        break;
      }
      case "popular":
      default:
        results = await getPopular(mediaType, page);
        totalPages = 500;
        break;
    }

    return NextResponse.json({ results, page, totalPages }, { headers: CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message }, { status: 500 });
  }
}
