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
    default: "DEVDROP — Enter the Digital Underground | Cybersecurity Tools & Simulators",
    template: "%s | DEVDROP",
  },
  description:
    "Explore interactive cybersecurity tools, satellite radar telemetry visualizers, virtual smartphone diagnostics, password entropy analyzers, and hacker terminal consoles.",
  keywords: [
    "hacker simulator",
    "cybersecurity tools",
    "fake hacker terminal",
    "location tracker simulator",
    "screen lock simulator",
    "cybersecurity games",
    "terminal simulator",
  ],
  authors: [{ name: "DEVDROP Security Labs" }],
  creator: "DEVDROP",
  publisher: "DEVDROP Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://devdrop.online",
    siteName: "DEVDROP",
    title: "DEVDROP — Enter the Digital Underground",
    description:
      "Explore interactive cybersecurity tools, orbital satellite tracking, and Hollywood hacker simulators.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEVDROP — Cybersecurity & Hacker Simulator Platform",
    description:
      "Interactive cybersecurity tools, satellite telemetry simulations, and cyberpunk visual effects.",
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

        {/* Adsterra Network Global Monetization Scripts */}
        <Script
          src="https://bauval.org/14/94783fd09ebe476635f7fe67212b577c"
          strategy="afterInteractive"
          data-cfasync="false"
        />
        <Script
          src="https://abscloud.org/1/9d5697ac767cf97faee97125c54104ff"
          strategy="afterInteractive"
          data-cfasync="false"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DEVDROP",
              url: "https://devdrop.online",
              description:
                "Interactive cybersecurity tools and digital telemetry benchmarks.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://devdrop.online/tools?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
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
