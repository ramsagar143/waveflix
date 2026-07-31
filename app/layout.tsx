import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AmbientBackground from "@/components/AmbientBackground";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import SidebarSkyscraperAd from "@/components/SidebarSkyscraperAd";
import TelegramButton from "@/components/TelegramButton";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Movies, TV Shows & Anime`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    // Brand & General
    "WaveFlix",
    "WaveFlix streaming",
    "waveflix.online",
    "watch movies online free",
    "free movie streaming sites",
    
    // Movies Search Queries
    "watch full movies online free",
    "free hd movies stream",
    "watch latest movies online free",
    "best free movie websites",
    "watch movies online without signing up",
    "free movies online full length",
    "stream hollywood movies free",
    "stream bollywood movies online free",
    "watch marvel movies online free",
    "watch harry potter online free",
    
    // TV Shows & Web Series Search Queries
    "watch tv shows online free",
    "watch series online free",
    "free tv show streaming",
    "watch web series free online",
    "watch stranger things online free",
    "watch game of thrones online free",
    "watch house of the dragon free online",
    
    // Anime Search Queries
    "watch anime online free",
    "free anime streaming sites",
    "stream anime english subbed",
    "watch anime english dubbed free",
    "watch one piece online free",
    "watch demon slayer online free",
    "watch naruto online free",
    "watch jujutsu kaisen free online",
    "watch attack on titan online free",
    
    // OTT & Platforms Queries
    "free OTT platform streaming",
    "watch Netflix shows free online",
    "watch Prime Video shows free",
    "watch Disney Plus series free",
    "watch HBO Max online free",
    "soap2day alternatives",
    "fmovies alternatives",
    "123movies alternatives",
    "free streaming app for movies and tv shows",
    "watch anime free",
    "watch free movies and tv shows"
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { telephone: false },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Movies, TV Shows & Anime`,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Movies, TV Shows & Anime`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "google-adsense-account": "ca-pub-3119498931056624",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b12",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Unbounded:wght@500;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body
        className="bg-base-900 text-white antialiased"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        <style>{`:root{--font-display:'Unbounded',sans-serif;--font-body:'Sora',sans-serif;}`}</style>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3119498931056624"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Adsterra Popunder — next/script se load karo */}
        <Script
          src="https://interventioncopiedloitering.com/ea/0b/66/ea0b6624392f4516e561df54bbceefaf.js"
          strategy="afterInteractive"
        />
        {/* Adsterra SocialBar */}
        <Script
          src="https://interventioncopiedloitering.com/7f/ba/8a/7fba8a16f1052bde2768194308ebf54f.js"
          strategy="afterInteractive"
        />

        {/* Google tag (gtag.js) — Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TQLZB238N7"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TQLZB238N7');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xhmdg5vzag");
          `}
        </Script>

        {/* Cloudflare Web Analytics */}
        <Script
          id="cf-web-analytics"
          strategy="afterInteractive"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e30508b020f44aafb314f63d2d9e296d"}'
        />

        {/* Organization + WebSite structured data — helps Google understand
            the brand and can enable the sitelinks search box */}
        <Script id="ld-organization" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/icon.svg`,
          })}
        </Script>
        <Script id="ld-website" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
              "@type": "SearchAction",
              target: `${SITE_URL}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>

        <AmbientBackground />
        <KeyboardShortcuts />
        <SidebarSkyscraperAd />
        <Navbar />
        <main className="relative z-10 min-h-screen pb-24 md:pb-0 pt-[64px] md:pt-[76px]">
          {children}
        </main>
        <TelegramButton />

        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
