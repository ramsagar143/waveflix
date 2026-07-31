import Link from "next/link";
import type { Metadata } from "next";
import CategoryHeader from "@/components/CategoryHeader";
import InfiniteGrid from "@/components/InfiniteGrid";
import TopBannerAd from "@/components/TopBannerAd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { discoverAnime } from "@/lib/tmdb";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;

const TITLE = "Watch Anime Online Free";
const DESCRIPTION =
  "Series and films from Japan's finest animation studios — shonen epics, slice-of-life gems, and everything between, streaming on WaveFlix in HD.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "watch anime online free",
    "anime streaming",
    "latest anime series",
    "trending anime",
    "top rated anime",
    "anime movies",
    "WaveFlix anime",
  ],
  alternates: { canonical: `${SITE_URL}/anime` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/anime`,
    siteName: SITE_NAME,
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | ${SITE_NAME}`,
    description: DESCRIPTION,
  },
};

export default async function AnimePage({
  searchParams,
}: {
  searchParams: { sort?: string; type?: string };
}) {
  const sort = searchParams.sort || "popular";
  const type = (searchParams.type === "movie" ? "movie" : "tv") as "movie" | "tv";

  const sortMap: Record<string, string> = {
    popular: "popularity.desc",
    top_rated: "vote_average.desc",
    now_playing: "first_air_date.desc",
    trending: "popularity.desc",
  };

  const { results } = await discoverAnime(type, 1, sortMap[sort] || "popularity.desc");

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Anime", url: `${SITE_URL}/anime` },
        ]}
      />
      <CategoryHeader
        title="Anime"
        description="Series and films from Japan's finest animation studios — shonen epics, slice-of-life gems, and everything between."
        basePath="/anime"
        activeSort={sort}
        accent="#8b5cf6"
      />

      <div className="flex gap-2 px-4 md:px-8 mb-6 -mt-2">
        <Link
          href={`/anime?type=tv&sort=${sort}`}
          className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
            type === "tv"
              ? "bg-white text-black border-white"
              : "text-white/50 border-white/10"
          }`}
        >
          Series
        </Link>
        <Link
          href={`/anime?type=movie&sort=${sort}`}
          className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
            type === "movie"
              ? "bg-white text-black border-white"
              : "text-white/50 border-white/10"
          }`}
        >
          Movies
        </Link>
      </div>

      <TopBannerAd />

      <InfiniteGrid
        mediaType={type}
        category="anime"
        initialItems={results}
        initialPage={1}
        animeSort={sort}
      />
    </div>
  );
}
