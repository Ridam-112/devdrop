import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

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
  metadataBase: new URL("https://devdrop.online"),
  title: {
    default: "DevDrop — Free Online Web Tools, Utilities & Browser Games",
    template: "%s | DevDrop",
  },
  description:
    "DevDrop (devdrop.online) provides free online web utilities: image compressors, photo background remover, QR code generators, PDF makers, and open-source HTML5 browser games.",
  authors: [{ name: "DevDrop Core Team", url: "https://devdrop.online" }],
  creator: "DevDrop",
  publisher: "DevDrop Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devdrop.online",
    siteName: "DevDrop",
    title: "DevDrop — Free Online Web Tools, Utilities & Browser Games",
    description:
      "Free client-side web utilities, PDF creators, image compressors, and 70+ open-source browser games.",
    images: [
      {
        url: "https://devdrop.online/logo.png",
        width: 1024,
        height: 1024,
        alt: "DevDrop Brand Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevDrop — Free Online Web Tools & Utilities",
    description:
      "Free everyday web utilities, developer tools, and browser games running fast with zero sign-up required.",
    images: ["https://devdrop.online/logo.png"],
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
        {/* Google AdSense Verification & Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9589062360097471"
          crossOrigin="anonymous"
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

        {/* Adsterra Social Bar */}
        <script
          data-cfasync="false"
          src="https://bauval.org/14/94783fd09ebe476635f7fe67212b577c"
        />
        {/* Adsterra Popunder */}
        <script
          data-cfasync="false"
          src="https://abscloud.org/1/9d5697ac767cf97faee97125c54104ff"
        />

        {/* Monetag Global Ad Script */}
        <Script
          src="https://quge5.com/88/tag.min.js"
          strategy="afterInteractive"
          data-zone="309157"
          data-cfasync="false"
        />

        {/* Preload brand logo for Core Web Vitals LCP */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://devdrop.online/#website",
                  "url": "https://devdrop.online",
                  "name": "DevDrop",
                  "alternateName": [
                    "DevDrop Online",
                    "devdrop",
                    "Dev Drop",
                    "devdrop.online",
                    "DevDrop Tools"
                  ],
                  "description":
                    "Free online web utility suite with image compressors, PDF converters, developer tools, and open-source HTML5 browser games.",
                  "publisher": {
                    "@id": "https://devdrop.online/#organization"
                  },
                  "inLanguage": "en-US",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://devdrop.online/tools?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://devdrop.online/#organization",
                  "name": "DevDrop",
                  "url": "https://devdrop.online",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://devdrop.online/logo.png",
                    "width": 1024,
                    "height": 1024
                  },
                  "sameAs": [
                    "https://github.com/Ridam-112/devdrop"
                  ]
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://devdrop.online/#application",
                  "name": "DevDrop",
                  "applicationCategory": "UtilitiesApplication",
                  "operatingSystem": "All modern browsers (Chrome, Edge, Safari, Firefox), Windows, macOS, Linux, iOS, Android",
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  },
                  "featureList": [
                    "140+ Client-Side Developer Tools",
                    "Direct Device File Drop & QR Code Sharing",
                    "Image Compressor & Format Converter",
                    "Photo Background Remover",
                    "Pure Client-Side PDF Maker & Photo to PDF",
                    "70+ Curated Open Source HTML5 & 3D Browser Games",
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
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <Navbar />
        <div className="flex-1 w-full flex flex-col">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
