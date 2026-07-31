import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import OTTRow from "@/components/OTTRow";
import UpcomingAd from "@/components/UpcomingAd";
import BannerAd from "@/components/BannerAd";
import TopBannerAd from "@/components/TopBannerAd";
import InFeedAd from "@/components/InFeedAd";
import {
  getTrending,
  getPopular,
  getTopRated,
  getNowPlayingMovies,
  getOnTheAirTV,
  discoverAnime,
} from "@/lib/tmdb";
import { getOTTPlatforms } from "@/lib/ott";
import { dailyShuffle } from "@/lib/utils";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: `${SITE_NAME} — Watch Movies, TV Shows & Anime Online Free`,
  description: SITE_DESCRIPTION,
  keywords: [
    "WaveFlix",
    "watch movies online free",
    "watch tv shows online free",
    "watch anime online free",
    "free streaming site",
    "trending movies",
    "trending tv shows",
    "trending anime",
    "OTT platforms",
  ],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Watch Movies, TV Shows & Anime Online Free`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Watch Movies, TV Shows & Anime Online Free`,
    description: SITE_DESCRIPTION,
  },
};

export default async function HomePage() {
  const [
    trendingAll,
    popularMovies,
    popularTV,
    topRatedMovies,
    nowPlaying,
    onAir,
    animeTV,
    animeMovies,
    ottPlatforms,
  ] = await Promise.all([
    getTrending("all", "day"),
    getPopular("movie"),
    getPopular("tv"),
    getTopRated("movie"),
    getNowPlayingMovies(),
    getOnTheAirTV(),
    discoverAnime("tv"),
    discoverAnime("movie"),
    getOTTPlatforms(),
  ]);

  const heroPool = dailyShuffle(trendingAll, "hero").slice(0, 8);
  const trendingRow = dailyShuffle(trendingAll, "trending").slice(0, 20);
  const moviesRow = dailyShuffle(popularMovies, "movies").slice(0, 20);
  const tvRow = dailyShuffle(popularTV, "tv").slice(0, 20);
  const animeRow = dailyShuffle([...animeTV.results, ...animeMovies.results], "anime").slice(0, 20);
  const topRatedRow = dailyShuffle(topRatedMovies, "top-rated").slice(0, 20);
  const nowPlayingRow = dailyShuffle(nowPlaying, "now-playing").slice(0, 20);
  const onAirRow = dailyShuffle(onAir, "on-air").slice(0, 20);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Trending Today on WaveFlix",
    itemListElement: trendingRow.slice(0, 10).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/details/${item.mediaType}/${item.id}`,
      name: item.title,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Hero items={heroPool} />

      {/* Ad — top banner, first natural break after the hero */}
      <TopBannerAd />

      <OTTRow platforms={ottPlatforms} />

      <div className="mt-2 md:mt-4">
        <ContentRow
          title="Trending Today"
          subtitle="Updated daily, straight from TMDB"
          items={trendingRow}
          viewAllHref="/movies?sort=trending"
          accent="#ff3ea5"
        />

        {/* Ad — Trending ke baad */}
        <UpcomingAd />

        <ContentRow
          title="New Releases"
          subtitle="Fresh in theaters right now"
          items={nowPlayingRow}
          viewAllHref="/movies?sort=now_playing"
          accent="#ffd23d"
        />
        <ContentRow
          title="Popular Movies"
          items={moviesRow}
          viewAllHref="/movies"
          accent="#4f7dff"
        />

        {/* Ad — Movies ke baad */}
        <UpcomingAd />

        <ContentRow
          title="Popular TV Shows"
          items={tvRow}
          viewAllHref="/tv-shows"
          accent="#22e2d6"
        />

        {/* Ad — 300x250 in-feed, before Anime */}
        <InFeedAd />

        <ContentRow
          title="Anime Spotlight"
          subtitle="Top anime series & films"
          items={animeRow}
          viewAllHref="/anime"
          accent="#8b5cf6"
        />

        {/* Ad — Anime ke baad */}
        <UpcomingAd />

        <ContentRow
          title="Airing This Week"
          items={onAirRow}
          viewAllHref="/tv-shows?sort=on_the_air"
          accent="#3ddc84"
        />
        <ContentRow
          title="Top Rated"
          subtitle="Critically acclaimed favorites"
          items={topRatedRow}
          viewAllHref="/movies?sort=top_rated"
          accent="#ff8a3d"
        />
      </div>

      {/* Bottom banner ad */}
      <BannerAd />
    </div>
  );
}
