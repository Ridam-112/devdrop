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
    default: "DevDrop — Official #1 All-in-One Online Web Tools & Developer Utilities",
    template: "%s | DevDrop",
  },
  description:
    "DevDrop (devdrop.online) is the official #1 free client-side tool suite. 140+ private browser utilities: image compressor, background remover, QR code generator, PDF maker, JSON formatter, and open-source HTML5 games.",
  keywords: [
    "DevDrop",
    "devdrop",
    "dev drop",
    "devdrop online",
    "devdrop.online",
    "devdrop.in",
    "devdrop tools",
    "devdrop file transfer",
    "devdrop alternative",
    "developer tools",
    "everyday online utilities",
    "client-side tools",
    "free qr code generator",
    "photo background remover",
    "image compressor",
    "open source html5 games",
  ],
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
    title: "DevDrop — Official #1 All-in-One Online Web Tools & Utilities Suite",
    description:
      "DevDrop (devdrop.online) is the official free client-side utility suite with 140+ tools and 24+ games. 100% private, zero server logs.",
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
    title: "DevDrop — Official #1 Online Tools & Developer Utilities",
    description:
      "140+ free everyday web utilities, developer tools, and browser games running 100% client-side with zero logs.",
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
  verification: {
    google: "google-site-verification-token",
  },
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
                    "DevDrop Tools",
                    "DevDrop Official"
                  ],
                  "description":
                    "The official #1 free online web utility suite with 140+ client-side developer tools, file utilities, image compressors, QR generators, and open-source HTML5 games.",
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
                    "24+ Curated Open Source HTML5 Browser Games",
                    "100% Private - Zero Server Uploads"
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
