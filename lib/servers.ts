export interface StreamServer {
  id: string;
  name: string;
  /** Build the iframe embed URL for this server. */
  embedUrl: (opts: {
    mediaType: "movie" | "tv";
    tmdbId: number;
    season?: number;
    episode?: number;
  }) => string;
}

// Add more servers here later — the watch page UI (VideoPlayer /
// WatchClient) automatically renders a selector button for every
// entry in this list, no other code changes needed.
export const SERVERS: StreamServer[] = [
  {
    id: "nxsha",
    name: "Nxsha",
    embedUrl: ({ mediaType, tmdbId, season, episode }) =>
      mediaType === "movie"
        ? `https://nxsha.space/embed/movie/${tmdbId}`
        : `https://nxsha.space/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`,
  },
  {
    id: "screenscape",
    name: "ScreenScape",
    embedUrl: ({ mediaType, tmdbId, season, episode }) =>
      mediaType === "movie"
        ? `https://screenscape.me/embed?tmdb=${tmdbId}&type=movie`
        : `https://screenscape.me/embed?tmdb=${tmdbId}&type=tv&s=${season || 1}&e=${episode || 1}`,
  },
  {
    id: "peachify",
    name: "Peachify",
    embedUrl: ({ mediaType, tmdbId, season, episode }) =>
      mediaType === "movie"
        ? `https://peachify.pro/embed/movie/${tmdbId}`
        : `https://peachify.pro/embed/tv/${tmdbId}/${season || 1}/${episode || 1}`,
  },
];

export const DEFAULT_SERVER_ID = SERVERS[0].id;
