import { NextRequest, NextResponse } from "next/server";
import { getSeasonDetails } from "@/lib/tmdb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tvId = searchParams.get("tvId");
  const season = searchParams.get("season");

  if (!tvId || season === null) {
    return NextResponse.json({ error: "Missing tvId or season" }, { status: 400 });
  }

  try {
    const data = await getSeasonDetails(tvId, Number(season));
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
