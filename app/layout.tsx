import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SITE_URL } from "@/lib/constants";
import { INDEXABLE_TOOLS_LABEL } from "@/lib/data/tools";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DevDrop — Free Online Web Tools, Utilities & Browser Games",
    template: "%s | DevDrop",
  },
  description:
    "DevDrop offers free web utilities: portfolio builder, image compressors, background remover, QR codes, PDF tools, and 56+ instant browser games.",
  authors: [{ name: "DevDrop Core Team", url: SITE_URL }],
  creator: "DevDrop",
  publisher: "DevDrop Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "DevDrop",
    title: "DevDrop — Free Online Web Tools, Utilities & Browser Games",
    description:
      "Free client-side web utilities, PDF creators, image compressors, and free browser games.",
    images: [
      {
        url: `${SITE_URL}/logo.png`,
        width: 512,
        height: 512,
        alt: "DevDrop Brand Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevDrop — Free Online Web Tools & Utilities",
    description:
      "Free everyday web utilities, developer tools, and browser games running fast with zero sign-up required.",
    images: [`${SITE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Preload brand WebP logo for Core Web Vitals LCP */}
        <link rel="preload" href="/logo.webp" as="image" type="image/webp" />

        {/* Google AdSense Script - Deferred for Mobile PageSpeed */}
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9589062360097471"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

        {/* Google Tag Manager / Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtm.js?id=GTM-KQDHZKTD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-gtm" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>

        {/* Adsterra Social Bar - Lazy loaded to eliminate render-blocking */}
        <Script
          id="adsterra-social-bar"
          data-cfasync="false"
          src="https://bauval.org/14/94783fd09ebe476635f7fe67212b577c"
          strategy="lazyOnload"
        />
        {/* Adsterra Popunder - Lazy loaded to eliminate render-blocking */}
        <Script
          id="adsterra-popunder"
          data-cfasync="false"
          src="https://abscloud.org/1/9d5697ac767cf97faee97125c54104ff"
          strategy="lazyOnload"
        />

        {/* Monetag Global Ad Script */}
        <Script
          id="monetag-global"
          src="https://quge5.com/88/tag.min.js"
          strategy="lazyOnload"
          data-zone="309157"
          data-cfasync="false"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  "url": SITE_URL,
                  "name": "DevDrop",
                  "alternateName": [
                    "DevDrop Online",
                    "devdrop",
                    "Dev Drop",
                    "devdrop.online",
                    "DevDrop Tools"
                  ],
                  "description":
                    "Free online web utility suite with image compressors, PDF converters, developer tools, and free HTML5 browser games.",
                  "publisher": {
                    "@id": `${SITE_URL}/#organization`
                  },
                  "inLanguage": "en-US",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${SITE_URL}/tools?q={search_term_string}`,
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  "name": "DevDrop",
                  "url": SITE_URL,
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${SITE_URL}/logo.png`,
                    "width": 512,
                    "height": 512
                  },
                  "email": "support@devdrop.online",
                  "telephone": "+1-800-338-3767",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "100 Innovation Way, Suite 400",
                    "addressLocality": "Wilmington",
                    "addressRegion": "DE",
                    "postalCode": "19801",
                    "addressCountry": "US"
                  },
                  "sameAs": [
                    "https://x.com/DevDropOnline",
                    "https://facebook.com/DevDropOnline",
                    "https://instagram.com/devdrop.online",
                    "https://linkedin.com/company/devdrop",
                    "https://youtube.com/@DevDropOnline",
                    "https://github.com/Ridam-112/devdrop"
                  ]
                },
                {
                  "@type": "LocalBusiness",
                  "@id": `${SITE_URL}/#localbusiness`,
                  "name": "DevDrop",
                  "image": `${SITE_URL}/logo.png`,
                  "telephone": "+1-800-338-3767",
                  "email": "support@devdrop.online",
                  "url": SITE_URL,
                  "priceRange": "$0",
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "100 Innovation Way, Suite 400",
                    "addressLocality": "Wilmington",
                    "addressRegion": "DE",
                    "postalCode": "19801",
                    "addressCountry": "US"
                  },
                  "openingHoursSpecification": [
                    {
                      "@type": "OpeningHoursSpecification",
                      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                      "opens": "09:00",
                      "closes": "18:00"
                    }
                  ],
                  "sameAs": [
                    "https://x.com/DevDropOnline",
                    "https://facebook.com/DevDropOnline",
                    "https://instagram.com/devdrop.online",
                    "https://linkedin.com/company/devdrop",
                    "https://youtube.com/@DevDropOnline",
                    "https://github.com/Ridam-112/devdrop"
                  ]
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": `${SITE_URL}/#application`,
                  "name": "DevDrop",
                  "applicationCategory": "UtilitiesApplication",
                  "operatingSystem": "All modern browsers (Chrome, Edge, Safari, Firefox), Windows, macOS, Linux, iOS, Android",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "featureList": [
                    `${INDEXABLE_TOOLS_LABEL} Client-Side Developer Tools`,
                    "Direct Device File Drop & QR Code Sharing",
                    "Image Compressor & Format Converter",
                    "Photo Background Remover",
                    "Pure Client-Side PDF Maker & Photo to PDF",
                    "Curated HTML5 & 3D Browser Games",
                    "Privacy-First Client Processing for Document & Developer Tools"
                  ]
                }
              ]
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen flex flex-col bg-cyber-bg text-slate-100 selection:bg-cyber-green selection:text-black antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KQDHZKTD"
            height="0"
            width="0"
            className="hidden invisible"
          />
        </noscript>
        <Navbar />
        <div className="flex-1 w-full flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
