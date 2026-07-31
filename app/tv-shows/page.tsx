import type { Metadata } from "next";
import CategoryHeader from "@/components/CategoryHeader";
import InfiniteGrid from "@/components/InfiniteGrid";
import TopBannerAd from "@/components/TopBannerAd";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getPopular, getTopRated, getOnTheAirTV, getTrending } from "@/lib/tmdb";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;

const TITLE = "Watch TV Shows Online Free";
const DESCRIPTION =
  "Binge-worthy series, from must-watch premieres to fan-favorite classics — updated daily on WaveFlix. Stream popular, trending and top-rated TV shows in HD.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "watch tv shows online free",
    "latest tv series",
    "trending tv shows",
    "top rated series",
    "binge watch series",
    "HD tv shows streaming",
    "WaveFlix tv shows",
  ],
  alternates: { canonical: `${SITE_URL}/tv-shows` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/tv-shows`,
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

export default async function TVShowsPage({
  searchParams,
}: {
  searchParams: { sort?: string };
}) {
  const sort = searchParams.sort || "popular";

  let items;
  switch (sort) {
    case "top_rated":
      items = await getTopRated("tv");
      break;
    case "now_playing":
    case "on_the_air":
      items = await getOnTheAirTV();
      break;
    case "trending":
      items = await getTrending("tv", "day");
      break;
    default:
      items = await getPopular("tv");
  }

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "TV Shows", url: `${SITE_URL}/tv-shows` },
        ]}
      />
      <CategoryHeader
        title="TV Shows"
        description="Binge-worthy series, from must-watch premieres to fan-favorite classics — updated straight from TMDB."
        basePath="/tv-shows"
        activeSort={sort === "on_the_air" ? "now_playing" : sort}
        accent="#22e2d6"
      />
      <TopBannerAd />
      <InfiniteGrid mediaType="tv" category={sort === "on_the_air" ? "now_playing" : sort} initialItems={items} initialPage={1} />
    </div>
  );
}
