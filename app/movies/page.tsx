import type { Metadata } from "next";
import CategoryHeader from "@/components/CategoryHeader";
import InfiniteGrid from "@/components/InfiniteGrid";
import TopBannerAd from "@/components/TopBannerAd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getPopular, getTopRated, getNowPlayingMovies, getTrending } from "@/lib/tmdb";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;

const TITLE = "Watch Movies Online Free";
const DESCRIPTION =
  "Browse trending, popular, top-rated and newly released movies — all streaming and updated daily on WaveFlix. Watch the latest blockbusters and timeless classics in HD.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "watch movies online free",
    "latest movies",
    "trending movies",
    "top rated movies",
    "new movie releases",
    "HD movies streaming",
    "WaveFlix movies",
  ],
  alternates: { canonical: `${SITE_URL}/movies` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/movies`,
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

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const sort = searchParams.sort || "popular";

  let items;
  switch (sort) {
    case "top_rated":
      items = await getTopRated("movie");
      break;
    case "now_playing":
      items = await getNowPlayingMovies();
      break;
    case "trending":
      items = (await getTrending("movie", "day"));
      break;
    default:
      items = await getPopular("movie");
  }

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Movies", url: `${SITE_URL}/movies` },
        ]}
      />
      <CategoryHeader
        title="Movies"
        description="Endless movies to explore — from blockbuster premieres to timeless classics, updated straight from TMDB."
        basePath="/movies"
        activeSort={sort}
        accent="#ff3ea5"
      />
      <TopBannerAd />
      <InfiniteGrid mediaType="movie" category={sort} initialItems={items} initialPage={1} />
    </div>
  );
}
