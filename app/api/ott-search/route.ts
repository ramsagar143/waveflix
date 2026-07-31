import { NextRequest, NextResponse } from "next/server";
import { searchMulti, getTitleWatchProviders } from "@/lib/tmdb";
import { getOTTPlatformBySlug } from "@/lib/ott";

const REGION = "IN";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "";
  const query = searchParams.get("q") || "";

  if (!slug || !query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const platform = await getOTTPlatformBySlug(slug, REGION);
    if (!platform) {
      return NextResponse.json({ results: [], error: "Unknown platform" }, { status: 404 });
    }

    // TMDB's text search can't be filtered by watch provider server-side, so we
    // search broadly first, then check availability per-title against this
    // platform (capped so this stays fast and within reasonable rate limits).
    const { results: searchResults } = await searchMulti(query);
    const candidates = searchResults.slice(0, 20);

    const checks = await Promise.all(
      candidates.map(async (item) => {
        try {
          const providers = await getTitleWatchProviders(item.mediaType, item.id, REGION);
          if (!providers) return null;
          const buckets = [
            ...(providers.flatrate || []),
            ...(providers.free || []),
            ...(providers.ads || []),
            ...(providers.rent || []),
            ...(providers.buy || []),
          ];
          const available = buckets.some((p: any) => p.provider_id === platform.providerId);
          return available ? item : null;
        } catch {
          return null;
        }
      })
    );

    const results = checks.filter(Boolean);
    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800" } }
    );
  } catch (err: any) {
    return NextResponse.json({ results: [], error: err.message }, { status: 500 });
  }
}
