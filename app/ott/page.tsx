import type { Metadata } from "next";
import { Tv2 } from "lucide-react";
import { getOTTPlatforms } from "@/lib/ott";
import OTTPlatformCard from "@/components/OTTPlatformCard";
import BannerAd from "@/components/BannerAd";
import TopBannerAd from "@/components/TopBannerAd";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "All Streaming Platforms",
  description:
    "Every OTT platform WaveFlix tracks — Netflix, Prime Video, JioHotstar and more — updated live from TMDB.",
  alternates: { canonical: `${SITE_URL}/ott` },
};

export default async function OTTLibraryPage() {
  const platforms = await getOTTPlatforms();

  return (
    <div>
      <div className="wave-bg px-4 md:px-8 pt-8 pb-6 md:pt-14 md:pb-10 mb-2">
        <div className="relative z-10">
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-white mb-2 flex items-center gap-3">
            <Tv2 size={34} className="text-neon-cyan shrink-0" />
            All Streaming Platforms
          </h1>
          <p className="text-white/50 text-sm md:text-base max-w-xl">
            Every OTT we track, updated live from TMDB. Tap a platform to browse everything
            streaming there.
          </p>
        </div>
      </div>

      <TopBannerAd />

      {platforms.length === 0 ? (
        <p className="text-white/40 text-sm px-4 md:px-8 py-10">
          Couldn&apos;t load streaming platforms right now — try again in a bit.
        </p>
      ) : (
        <div
          className="grid gap-5 md:gap-7 px-4 md:px-8 pb-16"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))" }}
        >
          {platforms.map((platform, i) => (
            <OTTPlatformCard key={platform.slug} platform={platform} size="grid" index={i} />
          ))}
        </div>
      )}

      {/* Bottom banner ad */}
      <BannerAd />
    </div>
  );
}
