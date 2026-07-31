import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getOTTPlatformBySlug, getOTTPlatforms, discoverByProvider, OTT_LOGO_URL } from "@/lib/ott";
import { SITE_URL } from "@/lib/site";
import OTTSearch from "@/components/OTTSearch";
import InfiniteGrid from "@/components/InfiniteGrid";
import TopBannerAd from "@/components/TopBannerAd";

export const revalidate = 3600;

// All curated platforms are known up front (short, fixed list) — pre-build
// every one of them so tapping any OTT tile opens instantly.
export async function generateStaticParams() {
  try {
    const platforms = await getOTTPlatforms();
    return platforms.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const platform = await getOTTPlatformBySlug(params.slug);
  if (!platform) return {};
  const title = `Watch on ${platform.name}`;
  return {
    title,
    description: platform.description,
    alternates: { canonical: `${SITE_URL}/ott/${platform.slug}` },
    openGraph: {
      title,
      description: platform.description,
      url: `${SITE_URL}/ott/${platform.slug}`,
    },
  };
}

const SORTS = [
  { key: "popular", label: "Popular" },
  { key: "trending", label: "Trending" },
  { key: "now_playing", label: "New Releases" },
  { key: "top_rated", label: "Top Rated" },
];

const SORT_MAP: Record<string, string> = {
  popular: "popularity.desc",
  trending: "popularity.desc",
  top_rated: "vote_average.desc",
};

export default async function OTTPlatformPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { sort?: string; type?: string };
}) {
  const platform = await getOTTPlatformBySlug(params.slug);
  if (!platform) notFound();

  const sort = searchParams.sort || "popular";
  const type = (searchParams.type === "tv" ? "tv" : "movie") as "movie" | "tv";
  const sortBy =
    sort === "now_playing"
      ? type === "movie"
        ? "primary_release_date.desc"
        : "first_air_date.desc"
      : SORT_MAP[sort] || "popularity.desc";

  const { results } = await discoverByProvider(type, platform.providerId, {
    page: 1,
    sortBy,
  });

  return (
    <div>
      {/* ---------- Platform hero ---------- */}
      <div
        className="relative px-4 md:px-8 pt-8 pb-8 md:pt-14 md:pb-10 mb-2 overflow-hidden"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 20% 0%, ${platform.color}33, transparent 70%)`,
        }}
      >
        <div className="relative z-10 flex items-center gap-4 md:gap-6">
          <div
            className="ott-glow shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-[22px] overflow-hidden bg-base-700 flex items-center justify-center"
            style={{
              background: `radial-gradient(circle at 50% 30%, ${platform.color}30, #14141f 75%)`,
            }}
          >
            <div className="relative w-[62%] h-[62%]">
              <SafeImage
                src={OTT_LOGO_URL(platform.logoPath)}
                fallbackSrc="/placeholder-poster.svg"
                alt={platform.name}
                fill
                sizes="112px"
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>
          <div>
            <h1 className="font-display font-extrabold text-2xl md:text-4xl text-white mb-1.5">
              {platform.name}
            </h1>
            <p className="text-white/50 text-sm md:text-base max-w-xl">{platform.description}</p>
          </div>
        </div>
      </div>

      <OTTSearch slug={platform.slug} platformName={platform.name} />

      {/* ---------- Movies / Series toggle ---------- */}
      <div className="flex gap-2 px-4 md:px-8 mb-4">
        <Link
          href={`/ott/${platform.slug}?type=movie&sort=${sort}`}
          className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
            type === "movie" ? "bg-white text-black border-white" : "text-white/50 border-white/10"
          }`}
        >
          Movies
        </Link>
        <Link
          href={`/ott/${platform.slug}?type=tv&sort=${sort}`}
          className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
            type === "tv" ? "bg-white text-black border-white" : "text-white/50 border-white/10"
          }`}
        >
          Series
        </Link>
      </div>

      {/* ---------- Category tabs ---------- */}
      <div className="flex flex-wrap gap-2 px-4 md:px-8 mb-6">
        {SORTS.map((s) => {
          const active = sort === s.key;
          return (
            <Link key={s.key} href={`/ott/${platform.slug}?type=${type}&sort=${s.key}`}>
              <span
                className={`inline-block px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition-colors ${
                  active ? "text-white border-transparent" : "text-white/50 border-white/10 hover:text-white hover:border-white/25"
                }`}
                style={active ? { background: platform.color } : {}}
              >
                {s.label}
              </span>
            </Link>
          );
        })}
      </div>

      <TopBannerAd />

      <InfiniteGrid
        mediaType={type}
        category={sort}
        provider={platform.providerId}
        initialItems={results}
        initialPage={1}
      />

      {results.length === 0 && (
        <p className="text-white/40 text-sm px-4 md:px-8 pb-16">
          Nothing found for {platform.name} in this category yet.
        </p>
      )}
    </div>
  );
}
