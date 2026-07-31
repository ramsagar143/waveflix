// Deterministic seeded PRNG so "random" shuffles stay the same all day
// and change again the next day.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function getTodaySeed(salt = "") {
  const today = new Date();
  const dateStr = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}-${salt}`;
  return stringToSeed(dateStr);
}

// Fisher-Yates shuffle using a seeded RNG — stable for the whole day.
export function dailyShuffle<T>(arr: T[], salt = ""): T[] {
  const rand = mulberry32(getTodaySeed(salt));
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function formatDate(dateStr: string) {
  if (!dateStr) return "TBA";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "TBA";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export function formatRuntime(minutes?: number) {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export const RAINBOW_COLORS = [
  "#ff3ea5",
  "#ff8a3d",
  "#ffd23d",
  "#3ddc84",
  "#22e2d6",
  "#4f7dff",
  "#8b5cf6",
];

export function colorForIndex(i: number) {
  return RAINBOW_COLORS[i % RAINBOW_COLORS.length];
}
