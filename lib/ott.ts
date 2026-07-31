import {
  getWatchProviderCatalog,
  discoverByProvider,
  RawWatchProvider,
  MediaType,
} from "./tmdb";

export interface OTTPlatform {
  slug: string;
  name: string;
  providerId: number;
  logoPath: string;
  color: string;
  description: string;
}

// The platforms we want to feature, in display order. `aliases` are matched
// (case-insensitively) against TMDB's live provider names so we always end
// up with the correct, current provider_id + logo instead of hardcoding IDs
// that can silently drift or vary by region.
const CURATED: {
  slug: string;
  name: string;
  aliases: string[];
  color: string;
  description: string;
}[] = [
  {
    slug: "netflix",
    name: "Netflix",
    aliases: ["netflix"],
    color: "#E50914",
    description: "Everything streaming on Netflix — originals, movies, and series.",
  },
  {
    slug: "prime-video",
    name: "Prime Video",
    aliases: ["amazon prime video", "prime video", "amazon prime"],
    color: "#00A8E1",
    description: "Everything streaming on Amazon Prime Video.",
  },
  {
    slug: "jiohotstar",
    name: "JioHotstar",
    aliases: ["jiohotstar", "disney+ hotstar", "disney plus hotstar", "hotstar"],
    color: "#0F3D91",
    description: "Everything streaming on JioHotstar.",
  },
  {
    slug: "sonyliv",
    name: "SonyLIV",
    aliases: ["sonyliv", "sony liv"],
    color: "#FFD200",
    description: "Everything streaming on SonyLIV.",
  },
  {
    slug: "zee5",
    name: "ZEE5",
    aliases: ["zee5"],
    color: "#8A1CED",
    description: "Everything streaming on ZEE5.",
  },
  {
    slug: "apple-tv",
    name: "Apple TV+",
    aliases: ["apple tv plus", "apple tv+", "apple tv"],
    color: "#A2AAAD",
    description: "Everything streaming on Apple TV+.",
  },
  {
    slug: "hbo-max",
    name: "HBO Max",
    aliases: ["hbo max", "max"],
    color: "#7B2FF7",
    description: "Everything streaming on HBO Max.",
  },
  {
    slug: "jiocinema",
    name: "JioCinema",
    aliases: ["jiocinema", "voot"],
    color: "#7A1FA2",
    description: "Everything streaming on JioCinema.",
  },
  {
    slug: "disney-plus",
    name: "Disney+",
    aliases: ["disney plus"],
    color: "#113CCF",
    description: "Everything streaming on Disney+.",
  },
  {
    slug: "hulu",
    name: "Hulu",
    aliases: ["hulu"],
    color: "#1CE783",
    description: "Everything streaming on Hulu.",
  },
  {
    slug: "paramount-plus",
    name: "Paramount+",
    aliases: ["paramount plus", "paramount+"],
    color: "#0064FF",
    description: "Everything streaming on Paramount+.",
  },
  {
    slug: "peacock",
    name: "Peacock",
    aliases: ["peacock premium", "peacock"],
    color: "#F5A623",
    description: "Everything streaming on Peacock.",
  },
  {
    slug: "lionsgate-play",
    name: "Lionsgate Play",
    aliases: ["lionsgate play", "lionsgate+"],
    color: "#FFB800",
    description: "Everything streaming on Lionsgate Play.",
  },
  {
    slug: "mubi",
    name: "MUBI",
    aliases: ["mubi"],
    color: "#FF2D2D",
    description: "Everything streaming on MUBI.",
  },
  {
    slug: "crunchyroll",
    name: "Crunchyroll",
    aliases: ["crunchyroll"],
    color: "#F47521",
    description: "Everything streaming on Crunchyroll.",
  },
];

function normalize(name: string) {
  return name.trim().toLowerCase();
}

function matchesCurated(providerName: string, aliases: string[]) {
  const n = normalize(providerName);
  return aliases.some((alias) => {
    const a = normalize(alias);
    // short aliases (e.g. "max") need an exact match to avoid false positives
    return a.length <= 4 ? n === a : n.includes(a);
  });
}

let cachedPlatforms: OTTPlatform[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour in-process cache on top of the fetch cache

// Merges the movie + tv provider catalogs from TMDB, matches them against
// our curated list, and returns only the platforms we actually found —
// each with a live, correct provider_id and logo.
export async function getOTTPlatforms(region = "IN"): Promise<OTTPlatform[]> {
  if (cachedPlatforms && Date.now() - cachedAt < CACHE_TTL_MS) return cachedPlatforms;

  let movieProviders: RawWatchProvider[] = [];
  let tvProviders: RawWatchProvider[] = [];
  try {
    [movieProviders, tvProviders] = await Promise.all([
      getWatchProviderCatalog("movie", region),
      getWatchProviderCatalog("tv", region),
    ]);
  } catch {
    return cachedPlatforms || [];
  }

  const byId = new Map<number, RawWatchProvider>();
  [...movieProviders, ...tvProviders].forEach((p) => {
    if (!byId.has(p.provider_id)) byId.set(p.provider_id, p);
  });
  const allProviders = Array.from(byId.values());

  const platforms: OTTPlatform[] = [];
  for (const curated of CURATED) {
    const match = allProviders.find((p) => matchesCurated(p.provider_name, curated.aliases));
    if (!match) continue;
    platforms.push({
      slug: curated.slug,
      name: curated.name,
      providerId: match.provider_id,
      logoPath: match.logo_path,
      color: curated.color,
      description: curated.description,
    });
  }

  cachedPlatforms = platforms;
  cachedAt = Date.now();
  return platforms;
}

export async function getOTTPlatformBySlug(slug: string, region = "IN"): Promise<OTTPlatform | null> {
  const platforms = await getOTTPlatforms(region);
  return platforms.find((p) => p.slug === slug) || null;
}

export const OTT_LOGO_URL = (logoPath: string) => `https://image.tmdb.org/t/p/original${logoPath}`;

export { discoverByProvider };
export type { MediaType };
