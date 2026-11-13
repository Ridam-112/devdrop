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
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-cyber-muted mb-6 flex-wrap">
        <Link href="/" className="hover:text-cyber-green transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tools" className="hover:text-cyber-green transition-colors">
          All Tools
        </Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/category/${category.slug}`} className="hover:text-cyber-green transition-colors">
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-cyber-green font-semibold truncate max-w-[220px] sm:max-w-none">
          {tool.name}
        </span>
      </nav>

      {/* Privacy Guarantee Note */}
      <div className="mb-6 p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white font-mono block mb-0.5">Privacy &amp; Data Security</span>
          <p className="leading-relaxed">
            {tool.privacyNote
              ? tool.privacyNote
              : "100% In-Browser Privacy: All processing runs locally inside your browser memory. Your files and input data are never uploaded to any remote server or stored in any database."}
          </p>
        </div>
      </div>

      {/* Tool Header & Badge */}
      <header className="mb-8 pb-6 border-b border-cyber-borderSubtle">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              {category && (
                <Link
                  href={`/category/${category.slug}`}
                  className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30 hover:bg-cyber-green/20 transition-colors"
                >
                  {category.name}
                </Link>
              )}
              {tool.badge && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyber-panel text-slate-300 border border-cyber-borderSubtle">
                  {tool.badge}
                </span>
              )}
              <span className="text-[11px] font-mono text-cyber-muted flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
                Active Diagnostic Engine
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-mono tracking-tight leading-snug">
              {tool.h1 || tool.name}
            </h1>

            <p className="text-sm sm:text-base font-mono text-cyber-cyan">
              {tool.tagline}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed pt-1">
              {tool.shortIntro}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 self-start md:self-auto">
            <ShareButton title={`${tool.name} on DEVDROP`} text={tool.description} />
          </div>
        </div>
      </header>

      {/* Primary Simulator Workspace */}
      <section aria-label="Interactive Tool Workspace" className="w-full mb-10">
        {renderSimulator()}
      </section>

      {/* Reserved Mid-Page Ad Slot (Non-obstructive) */}
      <AdvertisementSlot slotId={`tool-${tool.slug}-mid`} format="horizontal" className="my-10" />

      {/* Detailed Technical & Educational Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 pt-8 border-t border-cyber-borderSubtle">
        {/* Left 2 Columns: Deep Dive, Specs, Limits & Guide */}
        <div className="lg:col-span-2 space-y-8">
          {/* Deep Dive Description */}
          <section className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
            <h2 className="text-xl font-bold text-white font-mono mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyber-green" />
              Detailed Tool Overview
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {tool.longDescription}
            </p>
          </section>

          {/* System Capabilities & Features */}
          <section className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
            <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyber-cyan" />
              Technical Capabilities & Features
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 p-2.5 rounded-xl bg-cyber-dark/60 border border-cyber-borderSubtle/60">
                  <span className="w-5 h-5 rounded-md bg-cyber-green/10 text-cyber-green border border-cyber-green/30 text-xs font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Features and Limitations (PRD Requirement) */}
          <section className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
            <h2 className="text-xl font-bold text-white font-mono mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Operational Parameters & Boundaries
            </h2>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              System architecture specifications and operational boundaries:
            </p>
            <div className="space-y-2.5">
              {tool.limitations.map((limit, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-cyber-dark/80 border border-amber-500/20 text-xs font-mono text-slate-300 flex items-start gap-3">
                  <span className="text-amber-400 font-bold">ℹ️</span>
                  <span>{limit}</span>
                </div>
              ))}
            </div>
          </section>

          {/* How-To-Use Guide */}
          <section className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
            <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyber-cyan" />
              System Operation Guide
            </h2>
            <div className="space-y-3 text-sm text-slate-300">
              {tool.howItWorks.map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle font-mono text-xs text-slate-300 flex items-start gap-3">
                  <span className="text-cyber-green font-bold whitespace-nowrap">Step {idx + 1}:</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Frequently Asked Questions (Tool Specific) */}
          <section className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
            <h2 className="text-xl font-bold text-white font-mono mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyber-green" />
              Technical Q&amp;A
            </h2>
            <div className="space-y-4">
              {tool.faqs.map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-cyber-dark/80 border border-cyber-borderSubtle space-y-1.5">
                  <h3 className="text-sm font-bold text-white font-mono flex items-start gap-2">
                    <span className="text-cyber-green">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Security Hygiene, Category Navigation & Sidebar Ad */}
        <aside className="space-y-6">
          {/* Security Hygiene Card */}
          <div className="p-6 rounded-2xl bg-cyber-card border border-cyber-borderSubtle">
            <div className="flex items-center gap-2 text-cyber-green font-mono font-bold text-sm mb-3">
              <ShieldCheck className="w-5 h-5" />
              <span>Security Hygiene Standards</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Defend your real hardware, accounts, and networks with industry-standard defenses:
            </p>
            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyber-green font-bold">✓</span>
                <span>Enable Two-Factor Authentication (2FA) with hardware keys or authenticator apps.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-green font-bold">✓</span>
                <span>Generate 16+ character unique passphrases using an encrypted password manager.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-green font-bold">✓</span>
                <span>Never share SMS one-time pins (OTPs) or click unverified login links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyber-green font-bold">✓</span>
                <span>Apply OS firmware and router security patches promptly upon release.</span>
              </li>
            </ul>
          </div>

          {/* Quick Category Jump */}
          {category && (
            <div className="p-5 rounded-2xl bg-cyber-dark border border-cyber-borderSubtle">
              <div className="text-xs font-mono text-cyber-muted uppercase mb-2">Category Hub</div>
              <h3 className="text-base font-bold text-white font-mono mb-2">{category.name}</h3>
              <p className="text-xs text-slate-400 mb-4">{category.description}</p>
              <Link
                href={`/category/${category.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-cyber-cyan hover:underline font-bold"
              >
                <span>Browse all {category.name} tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Sidebar Ad Placement */}
          <AdvertisementSlot slotId={`tool-${tool.slug}-sidebar`} format="rectangle" />
        </aside>
      </div>

      {/* Related Tools Crawlable Section */}
      {relatedTools.length > 0 && (
        <section className="mt-16 pt-10 border-t border-cyber-borderSubtle" aria-label="Related Online Tools">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-green">
                Explore More Tools
              </span>
              <h2 className="text-2xl font-extrabold text-white font-mono mt-1">
                Related Online Tools
              </h2>
            </div>
            <Link
              href="/tools"
              className="text-xs font-mono font-semibold text-cyber-cyan hover:underline flex items-center gap-1"
            >
              All Tools <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.slice(0, 3).map((rTool) => (
              <ToolCard key={rTool.slug} tool={rTool} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
