import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load TMDB_READ_ACCESS_TOKEN from environment or .env.local
let token = process.env.TMDB_READ_ACCESS_TOKEN;
if (!token) {
  const envPath = path.join(rootDir, ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const match = envContent.match(/TMDB_READ_ACCESS_TOKEN=["']?([^"'\r\n]+)["']?/);
    if (match) {
      token = match[1];
    }
  }
}

if (!token) {
  console.error("❌ TMDB_READ_ACCESS_TOKEN is missing! Please set it in .env.local or environment variables.");
  process.exit(1);
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://waveflix.online").replace(/\/$/, "");
const TMDB_BASE = "https://api.themoviedb.org/3";

function slugify(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function xmlEscape(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isValidDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return false;
  return /^\d{4}-\d{2}-\d{2}$/.test(dateStr.trim());
}

function formatDate(dateStr, today) {
  if (isValidDate(dateStr)) {
    const trimmed = dateStr.trim();
    if (trimmed <= today) return trimmed;
  }
  return today;
}

async function tmdbFetch(endpoint, params = {}) {
  const url = new URL(TMDB_BASE + endpoint);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      url.searchParams.set(key, String(val));
    }
  });

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`TMDB error ${res.status} for ${endpoint}: ${errText}`);
  }
  return res.json();
}

async function fetchBatch(fetcher, pages, batchSize = 15) {
  const results = [];
  for (let i = 0; i < pages.length; i += batchSize) {
    const batch = pages.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map((p) => fetcher(p)));
    batchResults.forEach((res) => {
      if (res.status === "fulfilled" && res.value) {
        results.push(...res.value);
      }
    });
  }
  return results;
}

function generateUrlSetXml(urls, today) {
  const items = urls
    .map((u) => {
      const loc = xmlEscape(u.url);
      const mod = formatDate(u.lastmod, today);
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${mod}</lastmod>\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

function generateSitemapIndexXml(sitemaps, today) {
  const items = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${xmlEscape(s)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>`;
}

async function main() {
  console.log("🚀 Starting Optimized Title-Slug 10,000+ Sitemap Generation...");
  console.log(`🌐 Base URL: ${SITE_URL}`);

  const today = new Date().toISOString().split("T")[0];

  const staticUrls = [
    { url: `${SITE_URL}/`, lastmod: today },
    { url: `${SITE_URL}/movies`, lastmod: today },
    { url: `${SITE_URL}/tv-shows`, lastmod: today },
    { url: `${SITE_URL}/anime`, lastmod: today },
    { url: `${SITE_URL}/ott`, lastmod: today },
    { url: `${SITE_URL}/search`, lastmod: today },
  ];

  const ottSlugs = [
    "netflix", "prime-video", "jiohotstar", "sonyliv", "zee5", 
    "apple-tv", "hbo-max", "jiocinema", "disney-plus", "hulu", 
    "paramount-plus", "peacock", "lionsgate-play", "mubi", "crunchyroll"
  ];

  const ottUrls = ottSlugs.map((slug) => ({
    url: `${SITE_URL}/ott/${slug}`,
    lastmod: today,
  }));

  const searchQueries = [
    "action", "comedy", "drama", "horror", "romance", "sci-fi", "thriller", 
    "adventure", "animation", "crime", "documentary", "family", "fantasy", 
    "history", "mystery", "war", "western", "k-drama", "anime", "bollywood", 
    "hollywood", "hindi-dubbed", "south-indian", "marvel", "dc", "netflix-series", 
    "trending", "popular", "2026-movies", "top-rated"
  ];

  const searchUrls = searchQueries.map((q) => ({
    url: `${SITE_URL}/search?q=${encodeURIComponent(q)}`,
    lastmod: today,
  }));

  const movieUrlsMap = new Map();
  const tvUrlsMap = new Map();
  const animeUrlsMap = new Map();

  // 1. Movies (350 pages -> 7,000 items)
  console.log("🎬 Fetching Movies with Title Slugs (Pages 1-350)...");
  const moviePages = Array.from({ length: 350 }, (_, i) => i + 1);
  await fetchBatch(
    async (page) => {
      const data = await tmdbFetch("/discover/movie", { page, sort_by: "popularity.desc" });
      return (data.results || []).map((m) => ({
        id: m.id,
        title: m.title || m.original_title,
        date: m.release_date,
      }));
    },
    moviePages,
    15
  ).then((items) => {
    items.forEach((m) => {
      if (m && m.id && !movieUrlsMap.has(m.id)) {
        const slug = slugify(m.title);
        const path = slug ? `${m.id}-${slug}` : String(m.id);
        movieUrlsMap.set(m.id, {
          url: `${SITE_URL}/details/movie/${path}`,
          lastmod: formatDate(m.date, today),
        });
      }
    });
  });
  console.log(`✅ Movies: ${movieUrlsMap.size}`);

  // 2. TV Shows (250 pages -> 5,000 items)
  console.log("📺 Fetching TV Shows with Title Slugs (Pages 1-250)...");
  const tvPages = Array.from({ length: 250 }, (_, i) => i + 1);
  await fetchBatch(
    async (page) => {
      const data = await tmdbFetch("/discover/tv", { page, sort_by: "popularity.desc" });
      return (data.results || []).map((t) => ({
        id: t.id,
        title: t.name || t.original_name,
        date: t.first_air_date,
      }));
    },
    tvPages,
    15
  ).then((items) => {
    items.forEach((t) => {
      if (t && t.id && !tvUrlsMap.has(t.id)) {
        const slug = slugify(t.title);
        const path = slug ? `${t.id}-${slug}` : String(t.id);
        tvUrlsMap.set(t.id, {
          url: `${SITE_URL}/details/tv/${path}`,
          lastmod: formatDate(t.date, today),
        });
      }
    });
  });
  console.log(`✅ TV Shows: ${tvUrlsMap.size}`);

  // 3. Anime
  console.log("🎌 Fetching Anime with Title Slugs...");
  const animeTvPages = Array.from({ length: 40 }, (_, i) => i + 1);
  const animeMoviePages = Array.from({ length: 30 }, (_, i) => i + 1);

  await fetchBatch(
    async (page) => {
      const data = await tmdbFetch("/discover/tv", {
        with_genres: 16,
        with_origin_country: "JP",
        sort_by: "popularity.desc",
        page,
      });
      return (data.results || []).map((a) => ({
        id: a.id,
        title: a.name || a.original_name,
        date: a.first_air_date,
      }));
    },
    animeTvPages,
    15
  ).then((items) => {
    items.forEach((a) => {
      if (a && a.id && !animeUrlsMap.has(`tv-${a.id}`)) {
        const slug = slugify(a.title);
        const path = slug ? `${a.id}-${slug}` : String(a.id);
        animeUrlsMap.set(`tv-${a.id}`, {
          url: `${SITE_URL}/details/tv/${path}`,
          lastmod: formatDate(a.date, today),
        });
      }
    });
  });

  await fetchBatch(
    async (page) => {
      const data = await tmdbFetch("/discover/movie", {
        with_genres: 16,
        with_origin_country: "JP",
        sort_by: "popularity.desc",
        page,
      });
      return (data.results || []).map((a) => ({
        id: a.id,
        title: a.title || a.original_title,
        date: a.release_date,
      }));
    },
    animeMoviePages,
    15
  ).then((items) => {
    items.forEach((a) => {
      if (a && a.id && !animeUrlsMap.has(`movie-${a.id}`)) {
        const slug = slugify(a.title);
        const path = slug ? `${a.id}-${slug}` : String(a.id);
        animeUrlsMap.set(`movie-${a.id}`, {
          url: `${SITE_URL}/details/movie/${path}`,
          lastmod: formatDate(a.date, today),
        });
      }
    });
  });
  console.log(`✅ Anime: ${animeUrlsMap.size}`);

  const publicDir = path.join(rootDir, "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Clean up old sitemap files
  fs.readdirSync(publicDir).forEach((file) => {
    if (file.startsWith("sitemap") && file.endsWith(".xml")) {
      fs.unlinkSync(path.join(publicDir, file));
    }
  });

  const sitemapFiles = [];
  const CHUNK_SIZE = 1000;

  // Static
  const staticSet = [...staticUrls, ...ottUrls, ...searchUrls];
  fs.writeFileSync(path.join(publicDir, "sitemap-static.xml"), generateUrlSetXml(staticSet, today));
  sitemapFiles.push(`${SITE_URL}/sitemap-static.xml`);

  // Movies
  const movieList = Array.from(movieUrlsMap.values());
  let movieIdx = 1;
  for (let i = 0; i < movieList.length; i += CHUNK_SIZE) {
    const chunk = movieList.slice(i, i + CHUNK_SIZE);
    const fileName = `sitemap-movies-${movieIdx}.xml`;
    fs.writeFileSync(path.join(publicDir, fileName), generateUrlSetXml(chunk, today));
    sitemapFiles.push(`${SITE_URL}/${fileName}`);
    movieIdx++;
  }

  // TV
  const tvList = Array.from(tvUrlsMap.values());
  let tvIdx = 1;
  for (let i = 0; i < tvList.length; i += CHUNK_SIZE) {
    const chunk = tvList.slice(i, i + CHUNK_SIZE);
    const fileName = `sitemap-tv-${tvIdx}.xml`;
    fs.writeFileSync(path.join(publicDir, fileName), generateUrlSetXml(chunk, today));
    sitemapFiles.push(`${SITE_URL}/${fileName}`);
    tvIdx++;
  }

  // Anime
  const animeList = Array.from(animeUrlsMap.values());
  let animeIdx = 1;
  for (let i = 0; i < animeList.length; i += CHUNK_SIZE) {
    const chunk = animeList.slice(i, i + CHUNK_SIZE);
    const fileName = `sitemap-anime-${animeIdx}.xml`;
    fs.writeFileSync(path.join(publicDir, fileName), generateUrlSetXml(chunk, today));
    sitemapFiles.push(`${SITE_URL}/${fileName}`);
    animeIdx++;
  }

  // Master Index
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), generateSitemapIndexXml(sitemapFiles, today));

  const totalCount = staticSet.length + movieList.length + tvList.length + animeList.length;

  console.log("\n=========================================");
  console.log(`🎉 SITEMAP WITH TITLE SLUGS COMPLETE!`);
  console.log(`📊 Total URLs: ${totalCount}`);
  console.log(`📁 Sitemaps generated: ${sitemapFiles.length} files`);
  console.log("=========================================\n");
}

main().catch((err) => {
  console.error("❌ Sitemap Generation failed:", err);
  process.exit(1);
});
