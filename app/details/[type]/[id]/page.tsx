import SafeImage from "@/components/SafeImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Play, Star, Clock, Calendar, Globe, ListVideo } from "lucide-react";
import { getDetails, getTrending, getPopular, img, MediaType } from "@/lib/tmdb";
import { formatDate, formatRuntime } from "@/lib/utils";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import CastRow from "@/components/CastRow";
import UpcomingAd from "@/components/UpcomingAd";
import BannerAd from "@/components/BannerAd";
import InFeedAd from "@/components/InFeedAd";
import ContentRow from "@/components/ContentRow";
import PlayButton from "@/components/PlayButton";

export const revalidate = 3600;
// Any title not pre-built below is still rendered on first visit and then
// cached (ISR) — this just makes the most-tapped titles instant from the
// very first request instead of waiting on a live TMDB fetch.
export const dynamicParams = true;

// Pre-render details pages for today's trending + popular titles at build
// time, so tapping into the most-watched content opens instantly.
export async function generateStaticParams() {
  try {
    const [trending, popularMovies, popularTV] = await Promise.all([
      getTrending("all", "day"),
      getPopular("movie"),
      getPopular("tv"),
    ]);
    const seen = new Set<string>();
    const items = [...trending, ...popularMovies, ...popularTV];
    return items.reduce<{ type: string; id: string }[]>((acc, item) => {
      const key = `${item.mediaType}-${item.id}`;
      if (seen.has(key)) return acc;
      seen.add(key);
      acc.push({ type: item.mediaType, id: String(item.id) });
      return acc;
    }, []);
  } catch {
    return [];
  }
}

function languageName(code?: string) {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "language" }).of(code) || code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export async function generateMetadata({
  params,
}: {
  params: { type: string; id: string };
}): Promise<Metadata> {
  const mediaType = params.type as MediaType;
  if (mediaType !== "movie" && mediaType !== "tv") return {};

  try {
    const data = await getDetails(mediaType, params.id);
    if (!data || data.success === false) return {};

    const title = data.title || data.name;
    const year = (data.release_date || data.first_air_date || "").slice(0, 4);
    const description =
      data.overview || `Watch ${title} online on ${SITE_NAME} — stream now in HD.`;
    const backdrop = img.backdrop(data.backdrop_path, "w1280");
    const url = `${SITE_URL}/details/${mediaType}/${params.id}`;

    return {
      title: year ? `${title} (${year})` : title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: mediaType === "movie" ? "video.movie" : "video.tv_show",
        url,
        title,
        description,
        images: [{ url: backdrop, width: 1280, height: 720, alt: title }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [backdrop],
      },
    };
  } catch {
    return {};
  }
}

export default async function DetailsPage({
  params,
}: {
  params: { type: string; id: string };
}) {
  const mediaType = params.type as MediaType;
  if (mediaType !== "movie" && mediaType !== "tv") notFound();

  let data: any;
  try {
    data = await getDetails(mediaType, params.id);
  } catch {
    notFound();
  }
  if (!data || data.success === false) notFound();

  const title = data.title || data.name;
  const releaseDate = data.release_date || data.first_air_date;
  const runtime = data.runtime || data.episode_run_time?.[0];
  const genres: { id: number; name: string }[] = data.genres || [];
  const cast = data.credits?.cast || [];
  const recommendations = (data.recommendations?.results || []).map((r: any) => ({
    id: r.id,
    mediaType: (r.media_type || mediaType) as MediaType,
    title: r.title || r.name,
    overview: r.overview,
    posterPath: r.poster_path,
    backdropPath: r.backdrop_path,
    rating: r.vote_average || 0,
    releaseDate: r.release_date || r.first_air_date || "",
    genreIds: r.genre_ids || [],
    popularity: r.popularity || 0,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": mediaType === "movie" ? "Movie" : "TVSeries",
    name: title,
    description: data.overview || undefined,
    image: img.backdrop(data.backdrop_path, "w1280"),
    datePublished: releaseDate || undefined,
    genre: genres.map((g) => g.name),
    aggregateRating: data.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: data.vote_average,
          bestRating: 10,
          ratingCount: data.vote_count || 1,
        }
      : undefined,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ---------- Backdrop hero ---------- */}
      <div className="relative w-full h-[46vh] md:h-[64vh] min-h-[340px] overflow-hidden">
        <SafeImage
          src={img.backdrop(data.backdrop_path, "w1280")}
          fallbackSrc="/placeholder-backdrop.svg"
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base-900 via-base-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-base-900/90 md:from-base-900/70 to-transparent" />
        <svg
          className="absolute bottom-0 left-0 w-[200%] animate-wave-flow opacity-60"
          style={{ animationDuration: "16s" }}
          viewBox="0 0 2800 60"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="detailWave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff3ea5" />
              <stop offset="50%" stopColor="#22e2d6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            d="M0,30 C400,60 800,0 1200,30 C1600,60 2000,0 2400,30 C2600,45 2700,38 2800,30 L2800,60 L0,60 Z"
            fill="url(#detailWave)"
            opacity="0.45"
          />
        </svg>
      </div>

      {/* ---------- Content ---------- */}
      <div className="relative z-10 px-4 md:px-8 -mt-24 md:-mt-40 flex flex-col md:flex-row gap-6 md:gap-10">
        {/* Poster */}
        <div className="shrink-0 w-[140px] md:w-[240px] mx-auto md:mx-0">
          <div className="card-glow rounded-2xl overflow-hidden relative aspect-[2/3]">
            <SafeImage
              src={img.poster(data.poster_path, "w500")}
              fallbackSrc="/placeholder-poster.svg"
              alt={title}
              fill
              sizes="240px"
              className="object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
            {genres.map((g, i) => (
              <span
                key={g.id}
                className="text-[11px] font-bold px-3 py-1 rounded-full border border-white/15 text-white/70"
                style={{
                  background: `linear-gradient(120deg, transparent, ${
                    ["#ff3ea533", "#ffd23d33", "#3ddc8433", "#4f7dff33", "#8b5cf633"][i % 5]
                  })`,
                }}
              >
                {g.name}
              </span>
            ))}
          </div>

          <h1 className="font-display font-extrabold text-2xl md:text-4xl lg:text-5xl text-white mb-4 drop-shadow-lg">
            {title}
          </h1>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-5 text-sm text-white/70 mb-5">
            <span className="flex items-center gap-1.5 font-bold text-neon-yellow">
              <Star size={16} fill="currentColor" strokeWidth={0} />
              {data.vote_average?.toFixed(1) ?? "N/A"}
              <span className="text-white/40 font-normal">/ 10</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={15} /> {formatDate(releaseDate)}
            </span>
            {runtime && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> {formatRuntime(runtime)}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Globe size={15} /> {languageName(data.original_language)}
            </span>
            {mediaType === "tv" && data.number_of_seasons && (
              <span className="flex items-center gap-1.5">
                <ListVideo size={15} /> {data.number_of_seasons} Season
                {data.number_of_seasons > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0 mb-7">
            {data.overview || "No description available."}
          </p>

          <div className="flex justify-center md:justify-start gap-3">
            <PlayButton mediaType={mediaType} id={data.id} />
          </div>
        </div>
      </div>

      <div className="mt-10 md:mt-14">
        <CastRow cast={cast} />
        {/* Ad — 300x250, right after cast */}
        <InFeedAd />
        {/* Ad — Cast aur Recommendations ke beech */}
        <UpcomingAd />
        {recommendations.length > 0 && (
          <ContentRow
            title="You Might Also Like"
            items={recommendations}
            accent="#4f7dff"
          />
        )}

        {/* Bottom banner ad — below recommendations */}
        <BannerAd />
      </div>
    </div>
  );
}
