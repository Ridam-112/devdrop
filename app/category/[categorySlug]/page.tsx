import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ChevronRight, ArrowLeft, HelpCircle, Shield, FileText } from "lucide-react";
import { CATEGORIES, TOOLS, isCategoryIndexable } from "@/lib/data/tools";
import { ToolCard } from "@/components/ToolCard";
import { AdvertisementSlot } from "@/components/AdvertisementSlot";
import { SITE_URL } from "@/lib/constants";

interface Props {
  params: {
    categorySlug: string;
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    categorySlug: cat.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = CATEGORIES.find((c) => c.slug === params.categorySlug);
  if (!category) {
    return {
      title: "Category Not Found | DevDrop",
      robots: { index: false, follow: false },
    };
  }

  const isIndexable = isCategoryIndexable(category);
  const canonicalUrl = `${SITE_URL}/category/${category.slug}`;

  return {
    title: category.metaTitle,
    description: category.metaDescription,
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
      title: category.metaTitle,
      description: category.metaDescription,
      url: canonicalUrl,
      siteName: "DevDrop",
      locale: "en_US",
      type: "website",
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: `${category.name} category hub on DevDrop`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: category.metaTitle,
      description: category.metaDescription,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const category = CATEGORIES.find((c) => c.slug === params.categorySlug);

  if (!category) {
    notFound();
  }

  const isIndexable = isCategoryIndexable(category);
  const categoryTools = TOOLS.filter((t) => t.categorySlug === category.slug);
  const canonicalUrl = `${SITE_URL}/category/${category.slug}`;

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
        name: "Categories",
        item: `${SITE_URL}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: canonicalUrl,
      },
    ],
  };

  // Structured Data: CollectionPage
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    headline: category.h1,
    description: category.metaDescription,
    url: canonicalUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: categoryTools.map((tool, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/tools/${tool.slug}`,
        name: tool.name,
      })),
    },
  };

  // Structured Data: FAQPage
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: category.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Structured Data Scripts (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-cyber-muted mb-8">
        <Link href="/" className="hover:text-cyber-green transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tools" className="hover:text-cyber-green transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-cyber-green font-semibold">{category.name}</span>
      </nav>

      {/* Category Header */}
      <header className="bg-cyber-card/80 border border-cyber-borderSubtle rounded-2xl p-6 sm:p-10 mb-10 shadow-card-cyber">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyber-cyan px-2.5 py-1 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 inline-block mb-3">
          Category Hub
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-mono mb-3">
          {category.h1 || category.name}
        </h1>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          {category.longDescription || category.description}
        </p>

        <div className="mt-6 flex items-center gap-4 text-xs font-mono text-cyber-muted flex-wrap">
          <span className="text-cyber-green font-bold">{categoryTools.length} Tools Available</span>
          <span>•</span>
          <span>Browser Execution</span>
          <span>•</span>
          <span>Zero Installation</span>
        </div>
      </header>

      {/* Ad Slot */}
      <AdvertisementSlot slotId={`category-${category.slug}-banner`} format="horizontal" />

      {/* Tools Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" aria-label={`${category.name} Tools`}>
        {categoryTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </section>

      {/* Category Frequently Asked Questions */}
      {category.faqs && category.faqs.length > 0 && (
        <section className="mt-14 p-6 sm:p-8 rounded-2xl bg-cyber-card border border-cyber-borderSubtle space-y-6">
          <div className="flex items-center gap-2 text-cyber-green font-mono font-bold text-lg">
            <FileText className="w-5 h-5" />
            <h2>Frequently Asked Questions — {category.name}</h2>
          </div>
          <div className="space-y-4">
            {category.faqs.map((faq, idx) => (
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
      )}

      {/* Bottom Back Button */}
      <div className="mt-12 text-center">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyber-panel border border-cyber-borderSubtle text-xs font-mono text-slate-300 hover:text-white hover:border-cyber-green/40 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to All Tools Catalogue</span>
        </Link>
      </div>
    </div>
  );
}
