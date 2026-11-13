import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  ChevronRight,
  Calendar,
  Clock,
  ArrowRight,
  HelpCircle,
  Wrench,
  BookOpen,
} from "lucide-react";
import { GUIDES } from "@/lib/data/guides";
import { TOOLS } from "@/lib/data/tools";

interface Props {
  params: {
    guideSlug: string;
  };
}

export async function generateStaticParams() {
  return GUIDES.map((g) => ({
    guideSlug: g.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = GUIDES.find((g) => g.slug === params.guideSlug);
  if (!guide) {
    return {
      title: "Guide Not Found | DevDrop",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `https://devdrop.online/guides/${guide.slug}`;

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: canonicalUrl,
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
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: canonicalUrl,
      siteName: "DevDrop",
      type: "article",
      publishedTime: guide.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.metaTitle,
      description: guide.metaDescription,
    },
  };
}

export default function GuideDetailPage({ params }: Props) {
  const guide = GUIDES.find((g) => g.slug === params.guideSlug);

  if (!guide) {
    notFound();
  }

  const targetTool = TOOLS.find((t) => t.slug === guide.targetToolSlug);
  const canonicalUrl = `https://devdrop.online/guides/${guide.slug}`;

  // Structured Data: BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://devdrop.online",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: "https://devdrop.online/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: canonicalUrl,
      },
    ],
  };

  // Structured Data: Article
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    author: {
      "@type": "Organization",
      name: "DevDrop Editorial Team",
      url: "https://devdrop.online/about",
    },
    publisher: {
      "@type": "Organization",
      name: "DevDrop",
      url: "https://devdrop.online",
      logo: {
        "@type": "ImageObject",
        url: "https://devdrop.online/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  // Structured Data: FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.content.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-400 flex-wrap">
        <Link href="/" className="hover:text-emerald-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/guides" className="hover:text-emerald-400 transition-colors">
          Guides
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-emerald-400 font-semibold truncate max-w-[280px] sm:max-w-none">
          {guide.title}
        </span>
      </nav>

      {/* Header */}
      <header className="space-y-4 pb-8 border-b border-neutral-800">
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            {guide.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {guide.readingTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
          {guide.summary}
        </p>

        {/* Link to target tool CTA */}
        {targetTool && (
          <div className="pt-4">
            <Link
              href={`/tools/${targetTool.slug}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-mono text-xs tracking-wider transition-all shadow-lg shadow-emerald-500/20"
            >
              <Wrench className="w-4 h-4" />
              <span>OPEN {guide.targetToolName.toUpperCase()} NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </header>

      {/* Body Content */}
      <div className="prose prose-invert max-w-none space-y-8 text-neutral-300 font-sans text-sm sm:text-base leading-relaxed">
        <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-neutral-200 leading-relaxed font-sans">
          {guide.content.intro}
        </div>

        {guide.content.sections.map((sec, idx) => (
          <section key={idx} className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tight">
              {sec.heading}
            </h2>
            {sec.body.map((p, pIdx) => (
              <p key={pIdx} className="text-neutral-300 leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}

        {/* Dedicated Tool Feature Banner */}
        {targetTool && (
          <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Try It Live
              </span>
              <h3 className="text-lg font-bold text-white font-mono">
                {targetTool.name}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-lg">
                {targetTool.shortIntro || targetTool.description}
              </p>
            </div>
            <Link
              href={`/tools/${targetTool.slug}`}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-mono font-bold text-xs whitespace-nowrap transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <span>Launch Tool</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* FAQs */}
        {guide.content.faqs && guide.content.faqs.length > 0 && (
          <section className="pt-8 border-t border-neutral-800 space-y-6">
            <h2 className="text-2xl font-bold text-white font-mono flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {guide.content.faqs.map((faq, fIdx) => (
                <div key={fIdx} className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                  <h3 className="text-base font-bold text-white font-mono">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
