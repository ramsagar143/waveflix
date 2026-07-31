import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Search",
  description: "Search movies, TV shows and anime on WaveFlix.",
  alternates: { canonical: `${SITE_URL}/search` },
  robots: { index: false, follow: true },
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  return <SearchClient initialQuery={searchParams.q || ""} />;
}
