# WaveFlix 🌈

Ek Next.js (App Router) based movie/TV/anime discovery app — TMDB data, rainbow wave/glow animations, mobile-first app-jaisa feel, aur alag-alag easily-editable pages.

## Kya kya hai isme

- **Home / Movies / TV Shows / Anime / Search** — sabhi alag tabs, mobile me bottom app-bar aur desktop me top navbar (dono jagah click animation)
- **Auto-updating trending content** — TMDB se live data, `dailyShuffle()` (`lib/utils.ts`) se cards roz naya order lete hain (same din sabke liye same order, next day badal jaata hai)
- **Home slider** — 20 cards per row, smooth horizontal scroll (mobile touch + desktop arrows), har row ke upar **View All** button jo library-style infinite-scroll grid page kholta hai
- **Search tab** — type + Enter karte hi results niche se fly-in animation ke saath aate hain
- **Rainbow wave/glow theme** — har card, button, aur section header pe animated gradient glow
- **Details page** (`/details/[type]/[id]`) — poster, title, rating, release date, language, runtime, description, cast circles, aur "You Might Also Like" recommendations
- **Watch page** (`/watch/[type]/[id]`) — movie ke liye Play area, TV ke liye Season + Episode selector (episodes TMDB se live aate hain), niche recommendations
- **Infinite scroll** — Movies/TV Shows/Anime library pages me neeche scroll karte jao, content aata rahega (trending/popular/top rated/new filters ke saath)

### Streaming server (baad ke liye)

Jaisa tumne bola, streaming embed abhi add nahi kiya hai. Player ka poora UI (`components/VideoPlayer.tsx`) ready hai — bas ek jagah tumhe apna embed `<iframe>` uncomment karke URL daalna hai:

```tsx
// components/VideoPlayer.tsx ke andar:
<iframe
  src={embedUrl}   // apna streaming provider ka URL yaha banao
  allow="autoplay; fullscreen"
  allowFullScreen
  className="w-full h-full"
/>
```

`embedUrl` banane ka example (commented already) us file me hai — `mediaType`, `tmdbId`, aur TV ke liye `season`/`episode` sab already available hain us component me.

---

## Project structure (easy editing ke liye)

```
app/
  page.tsx                → Home page
  movies/page.tsx         → Movies tab (library + filters)
  tv-shows/page.tsx       → TV Shows tab
  anime/page.tsx          → Anime tab
  search/page.tsx         → Search tab
  details/[type]/[id]/    → Content details page
  watch/[type]/[id]/      → Player + season/episode selector page
  api/discover/           → Infinite-scroll pagination API
  api/search/             → Search API
  api/season/             → TV season/episode data API
  globals.css             → Rainbow theme + wave/glow animation CSS

components/
  Navbar.tsx               → Top nav (desktop) + bottom tab bar (mobile)
  Hero.tsx                 → Home page banner slider
  ContentRow.tsx            → Horizontal scroll rows (20-card sliders)
  ContentCard.tsx            → Individual movie/show card (glow hover)
  InfiniteGrid.tsx          → Library grid with infinite scroll
  CategoryHeader.tsx        → Page header + sort filter pills
  CastRow.tsx                → Cast circles row
  PlayButton.tsx             → Animated rainbow play button
  VideoPlayer.tsx            → Player placeholder (add your embed here)
  WatchClient.tsx             → Season/episode picker logic
  SearchClient.tsx            → Search page logic + fly-in animation
  AmbientBackground.tsx        → Global animated background

lib/
  tmdb.ts    → Saare TMDB API calls yahi se hote hain
  utils.ts   → dailyShuffle, date/runtime formatters
```

Har page/component alag file me hai, isliye jo bhi edit karna ho (colors, layout, ek tab ka content) us specific file me jaake karo — baaki kuch nahi tootega.

---

## Kaise run karein

### 1. Prerequisites
- [Node.js](https://nodejs.org) version **18.18 ya usse upar** (Node 20 recommended) install hona chahiye
- Internet connection (TMDB API aur Google Fonts ke liye)

### 2. Install karo
Terminal/Command Prompt kholo, project folder me jao:

```bash
cd waveflix
npm install
```

### 3. TMDB token check karo
`.env.local` file already ban chuki hai tumhare diye hue TMDB Read Access Token ke saath — kuch change karne ki zarurat nahi. Agar kabhi token badalna ho:

```
TMDB_READ_ACCESS_TOKEN=your_token_here
```

### 4. Dev server chalao (development / testing ke liye)

```bash
npm run dev
```

Browser me kholo: **http://localhost:3000**

Koi bhi file edit karoge, browser me turant reflect ho jayega (hot reload).

### 5. Production build (jab live deploy karna ho)

```bash
npm run build
npm run start
```

Ye optimized production version chalayega `http://localhost:3000` pe.

### 6. Deploy (optional, free hosting)

Sabse aasan tarika [Vercel](https://vercel.com) hai (Next.js banane wali company ka hi platform):

1. Project ko GitHub pe push karo
2. Vercel pe "New Project" → apna GitHub repo select karo
3. Environment Variables me `TMDB_READ_ACCESS_TOKEN` add karo (same value jo `.env.local` me hai)
4. Deploy dabao — 2 minute me live ho jayega

---

## Notes

- Anime tab TMDB ke "Animation" genre + "Japan" origin country ko combine karke banaya hai (TMDB me alag se "anime" category nahi hoti) — Series/Movies ke beech toggle upar milega.
- Daily shuffle date-seeded hai, isliye ek din me sabko same order dikhega, agle din khud-ba-khud naya order aa jayega — koi cron job/manual kaam nahi chahiye.
- Rainbow theme ke colors `tailwind.config.ts` me `neon.*` aur `app/globals.css` ke gradients me define hain — wahi se global color change ho sakta hai.
