import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { TOOLS, CATEGORIES, ToolItem, isToolIndexable } from "@/lib/data/tools";
import { SITE_URL } from "@/lib/constants";
import { ShareButton } from "@/components/ShareButton";
import { ToolCard } from "@/components/ToolCard";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";

// Simulator components
import { LocationTrackerSim } from "@/components/tools/LocationTrackerSim";
import { MobileHackerSim } from "@/components/tools/MobileHackerSim";
import { InstagramPrankSim } from "@/components/tools/InstagramPrankSim";
import { ScreenLockSim } from "@/components/tools/ScreenLockSim";
import { IpTraceSim } from "@/components/tools/IpTraceSim";
import { PasswordCrackerSim } from "@/components/tools/PasswordCrackerSim";
import { LieDetectorSim } from "@/components/tools/LieDetectorSim";
import { HackerTerminalSim } from "@/components/tools/HackerTerminalSim";
import { MobileRechargeSim } from "@/components/tools/MobileRechargeSim";

// Expanded Category Engines
import { WifiSimulatorEngine } from "@/components/tools/WifiSimulatorEngine";
import { GamingSimulatorEngine } from "@/components/tools/GamingSimulatorEngine";
import { SocialMediaEngine } from "@/components/tools/SocialMediaEngine";
import { MobileDeviceEngine } from "@/components/tools/MobileDeviceEngine";
import { FinanceSimulatorEngine } from "@/components/tools/FinanceSimulatorEngine";
import { AiFunnyEngine } from "@/components/tools/AiFunnyEngine";
import { VirusSimulatorEngine } from "@/components/tools/VirusSimulatorEngine";
import { SpySecretAgentEngine } from "@/components/tools/SpySecretAgentEngine";
import { IntelDnsEngine } from "@/components/tools/IntelDnsEngine";

// Everyday & Developer Tool Suites
import PhotoBgRemoverTool from "@/components/tools/PhotoBgRemoverTool";
import ImageCompressorTool from "@/components/tools/ImageCompressorTool";
import QrCodeGeneratorTool from "@/components/tools/QrCodeGeneratorTool";
import BarcodeGeneratorTool from "@/components/tools/BarcodeGeneratorTool";
import PdfMakerTool from "@/components/tools/PdfMakerTool";
import PhotoToPdfTool from "@/components/tools/PhotoToPdfTool";
import PortfolioBuilderTool from "@/components/tools/PortfolioBuilderTool";
import UtilityToolEngine from "@/components/tools/UtilityToolEngine";

interface Props {
  params: {
    toolSlug: string;
  };
}

export async function generateStaticParams() {
  return TOOLS.map((t) => ({
    toolSlug: t.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = TOOLS.find(
    (t) => t.slug === params.toolSlug || t.aliases?.includes(params.toolSlug)
  );
  if (!tool) {
    return {
      title: "Tool Not Found | DevDrop",
      robots: { index: false, follow: false },
    };
  }

  const isIndexable = isToolIndexable(tool);
  const canonicalUrl = `${SITE_URL}/tools/${tool.slug}`;

  // Standardized title format: "{Tool Name} – Free Online, No Upload | DevDrop" (50-60 chars)
  let pageTitle = `${tool.name} – Free Online, No Upload | DevDrop`;
  if (tool.slug === "photo-bg-remover") {
    pageTitle = "Photo Background Remover – Free AI Cutout Online | DevDrop";
  } else if (tool.metaTitle && tool.metaTitle.length <= 60 && !tool.metaTitle.includes("#1")) {
    pageTitle = tool.metaTitle;
  }
  if (!pageTitle.endsWith("DevDrop")) {
    pageTitle = `${pageTitle} | DevDrop`;
  }

  return {
    title: pageTitle,
    description: tool.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: isIndexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        }
      : {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
    openGraph: {
      title: pageTitle,
      description: tool.metaDescription,
      url: canonicalUrl,
      siteName: "DevDrop",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} interface preview on DevDrop`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: tool.metaDescription,
    },
  };
}

export default function ToolDetailPage({ params }: Props) {
  const tool = TOOLS.find(
    (t) => t.slug === params.toolSlug || t.aliases?.includes(params.toolSlug)
  );

  if (!tool) {
    notFound();
  }

  const category = CATEGORIES.find((c) => c.slug === tool.categorySlug);
  const isIndexable = isToolIndexable(tool);
  const relatedTools = TOOLS.filter(
    (t) => tool.relatedSlugs.includes(t.slug) && (isIndexable ? isToolIndexable(t) : true)
  );

  const canonicalUrl = `${SITE_URL}/tools/${tool.slug}`;

  // Structured Data: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "All Tools",
        item: `${SITE_URL}/tools`,
      },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: category.name,
              item: `${SITE_URL}/category/${category.slug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: tool.name,
              item: canonicalUrl,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: tool.name,
              item: canonicalUrl,
            },
          ]),
    ],
  };

  // Structured Data: WebApplication
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    headline: tool.h1 || tool.name,
    description: tool.metaDescription,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. HTML5 Canvas supported.",
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // Structured Data: FAQPage (Only emitted when FAQs are present)
  const faqJsonLd = tool.faqs && tool.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  const renderSimulator = () => {
    switch (tool.slug) {
      case "phone-location-prank":
      case "location-tracker":
        return <LocationTrackerSim />;
      case "mobile-hacker":
        return <MobileHackerSim />;
      case "instagram-hacker-simulator":
      case "instagram-prank":
        return <InstagramPrankSim />;
      case "phone-unlock-simulator":
      case "screen-lock":
        return <ScreenLockSim />;
      case "ip-trace":
        return <IpTraceSim />;
      case "password-strength-checker":
      case "password-simulator":
        return <PasswordCrackerSim />;
      case "lie-detector":
        return <LieDetectorSim />;
      case "fake-hacker-terminal":
      case "hacker-terminal":
        return <HackerTerminalSim />;
      case "mobile-recharge-portal":
      case "sim-recharge-engine":
      case "mobile-recharge":
        return <MobileRechargeSim />;
      case "image-compressor":
      case "image-size-compressor":
      case "photo-compressor":
      case "compress-image":
        return <ImageCompressorTool />;
      case "photo-bg-remover":
      case "image-background-remover":
      case "remove-bg":
        return <PhotoBgRemoverTool />;
      case "qr-code-generator":
      case "qr-maker":
      case "custom-qr-code":
        return <QrCodeGeneratorTool />;
      case "barcode-generator":
      case "barcode-maker":
      case "code128-generator":
        return <BarcodeGeneratorTool />;
      case "pdf-maker":
      case "text-to-pdf":
      case "notes-to-pdf":
        return <PdfMakerTool />;
      case "photo-to-pdf":
      case "images-to-pdf":
      case "jpg-to-pdf":
        return <PhotoToPdfTool />;
      case "portfolio-builder":
      case "portfolio-website-builder":
      case "free-portfolio-builder":
        return <PortfolioBuilderTool />;
      default:
        switch (tool.categorySlug) {
          case "image-media":
            if (tool.slug === "image-compressor") return <ImageCompressorTool />;
            if (tool.slug === "photo-bg-remover") return <PhotoBgRemoverTool />;
            return <UtilityToolEngine toolSlug={tool.slug} />;
          case "pdf-document":
            if (tool.slug === "photo-to-pdf") return <PhotoToPdfTool />;
            if (tool.slug === "pdf-maker") return <PdfMakerTool />;
            return <UtilityToolEngine toolSlug={tool.slug} />;
          case "developer-utils":
            if (tool.slug === "qr-code-generator") return <QrCodeGeneratorTool />;
            if (tool.slug === "barcode-generator") return <BarcodeGeneratorTool />;
            return <UtilityToolEngine toolSlug={tool.slug} />;
          case "wifi-network":
            return <WifiSimulatorEngine toolSlug={tool.slug} />;
          case "gaming-sims":
            return <GamingSimulatorEngine toolSlug={tool.slug} />;
          case "social-media":
            return <SocialMediaEngine toolSlug={tool.slug} />;
          case "mobile-devices":
            return <MobileDeviceEngine toolSlug={tool.slug} />;
          case "money-finance":
            return <FinanceSimulatorEngine toolSlug={tool.slug} />;
          case "ai-funny":
            return <AiFunnyEngine toolSlug={tool.slug} />;
          case "virus-security":
            return <VirusSimulatorEngine toolSlug={tool.slug} />;
          case "spy-stealth":
            return <SpySecretAgentEngine toolSlug={tool.slug} />;
          case "ip-intelligence":
            return <IntelDnsEngine toolSlug={tool.slug} />;
          default:
            return <UtilityToolEngine toolSlug={tool.slug} />;
        }
    }
  };

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Structured Data Scripts (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Modern Compact Application Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-cyber-borderSubtle">
        <div>
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-2 flex-wrap">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <Link href="/tools" className="hover:text-emerald-400 transition-colors">
              Tools
            </Link>
            {category && (
              <>
                <ChevronRight className="w-3 h-3 text-slate-600" />
                <Link href={`/category/${category.slug}`} className="hover:text-emerald-400 transition-colors">
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-emerald-400 font-semibold truncate max-w-[220px] sm:max-w-none">
              {tool.name}
            </span>
          </nav>

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {tool.name}
            </h1>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Client-Side Engine
            </span>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyber-dark text-slate-300 border border-cyber-borderSubtle">
              🔒 Zero Server Uploads
            </span>
            {category && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyber-card text-slate-400 border border-cyber-borderSubtle">
                {category.name}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-2xl">
            {tool.tagline}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          <ShareButton title={`${tool.name} on DevDrop`} text={tool.description} />
        </div>
      </div>

      {/* Primary Application Workspace */}
      <section aria-label="Interactive Tool Workspace" className="w-full mb-8">
        {renderSimulator()}
      </section>

      {/* Non-obstructive Ad Slot */}
      <AdvertisementSlot slotId={`tool-${tool.slug}-mid`} format="horizontal" className="my-8" />

      {/* Sleek Technical Information & Specifications Drawer (No Blog Wall) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left 2 Columns: Features, How It Works & FAQs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tool Overview & Key Features Card */}
          <div className="p-6 rounded-2xl bg-cyber-card/90 border border-cyber-borderSubtle space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold font-mono text-white">
                Features &amp; System Capabilities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {tool.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {tool.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-200 p-2.5 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle"
                >
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Operation Guide (Clean Step Pills) */}
          <div className="p-6 rounded-2xl bg-cyber-card/90 border border-cyber-borderSubtle space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyber-cyan" />
              <h2 className="text-base font-bold font-mono text-white">
                How It Works
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tool.howItWorks.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs space-y-1"
                >
                  <span className="text-[10px] font-mono font-bold text-cyber-cyan uppercase">
                    Step {idx + 1}
                  </span>
                  <p className="text-slate-300 leading-relaxed font-sans">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical FAQs (Clean Modern Accordions) */}
          {tool.faqs && tool.faqs.length > 0 && (
            <div className="p-6 rounded-2xl bg-cyber-card/90 border border-cyber-borderSubtle space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold font-mono text-white">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-3">
                {tool.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group rounded-xl bg-cyber-dark border border-cyber-borderSubtle p-3.5 transition-colors"
                  >
                    <summary className="cursor-pointer text-xs sm:text-sm font-mono font-bold text-white flex items-center justify-between list-none">
                      <span className="flex items-center gap-2">
                        <span className="text-emerald-400">Q:</span>
                        <span>{faq.question}</span>
                      </span>
                      <span className="text-slate-400 group-open:rotate-180 transition-transform text-xs">
                        ▼
                      </span>
                    </summary>
                    <p className="text-xs text-slate-300 font-sans mt-2.5 pt-2 border-t border-cyber-borderSubtle/60 leading-relaxed pl-5">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Column: Security, Boundaries & Category Jump */}
        <aside className="space-y-6">
          {/* Privacy & Sandboxing Guarantee */}
          <div className="p-5 rounded-2xl bg-cyber-card/90 border border-cyber-borderSubtle space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Data Protection Guarantee</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {tool.privacyNote ||
                "100% In-Browser Execution. All memory processing is isolated inside your browser sandbox. No telemetry, no logs, and no server uploads."}
            </p>
            <div className="text-[11px] font-mono text-slate-400 pt-1 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span>✓</span>
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span>✓</span>
                <span>Client-Side Memory Execution</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span>✓</span>
                <span>No Account Registration Required</span>
              </div>
            </div>
          </div>

          {/* Operational Parameters & Limits */}
          {tool.limitations && tool.limitations.length > 0 && (
            <div className="p-5 rounded-2xl bg-cyber-dark border border-cyber-borderSubtle space-y-2.5">
              <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Operating Specifications</span>
              </div>
              <div className="space-y-1.5">
                {tool.limitations.map((limit, idx) => (
                  <div key={idx} className="text-[11px] text-slate-400 font-mono flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{limit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Category Hub Jump */}
          {category && (
            <div className="p-5 rounded-2xl bg-cyber-card/90 border border-cyber-borderSubtle">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Category Hub
              </span>
              <h3 className="text-sm font-bold text-white font-mono mb-1">{category.name}</h3>
              <p className="text-xs text-slate-400 mb-3 line-clamp-2">{category.description}</p>
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:underline font-bold"
              >
                <span>Browse {category.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Sidebar Advertisement */}
          <AdvertisementSlot slotId={`tool-${tool.slug}-sidebar`} format="rectangle" />
        </aside>
      </div>

      {/* Related Tools Crawlable Section */}
      {relatedTools.length > 0 && (
        <section className="mt-12 pt-8 border-t border-cyber-borderSubtle" aria-label="Related Online Tools">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Explore More Tools
              </span>
              <h2 className="text-xl font-extrabold text-white font-mono mt-0.5">
                Related Utilities
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-xs font-mono font-semibold text-emerald-400 hover:underline flex items-center gap-1"
            >
              All Tools <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedTools.slice(0, 3).map((rTool) => (
              <ToolCard key={rTool.slug} tool={rTool} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
