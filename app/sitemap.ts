import { MetadataRoute } from "next";
import { TOOLS, CATEGORIES, isToolIndexable, isCategoryIndexable } from "@/lib/data/tools";
import { OPEN_SOURCE_GAMES, isGameIndexable } from "@/lib/data/games";
import { GUIDES } from "@/lib/data/guides";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  // Static core routes with real page update dates (no priority/changefreq as Google ignores them)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date("2026-11-13"),
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date("2026-11-13"),
    },
    {
      url: `${SITE_URL}/games`,
      lastModified: new Date("2026-11-10"),
    },
    {
      url: `${SITE_URL}/guides`,
      lastModified: new Date("2026-11-09"),
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date("2026-11-12"),
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date("2026-11-10"),
    },
    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: new Date("2026-11-01"),
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date("2026-11-13"),
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date("2026-10-25"),
    },
  ];

  // Dynamic indexable category routes only (3 core utility categories)
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter(isCategoryIndexable).map((cat) => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: new Date("2026-11-10"),
  }));

  // Dynamic indexable tool routes only (53 indexable tools)
  const toolRoutes: MetadataRoute.Sitemap = TOOLS.filter(isToolIndexable).map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: new Date("2026-11-10"),
  }));

  // Dynamic guides routes with per-article publication dates
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedAt),
  }));

  // Dynamic original game routes: 56 indexable games
  const gameRoutes: MetadataRoute.Sitemap = OPEN_SOURCE_GAMES.filter(isGameIndexable).map((game) => ({
    url: `${SITE_URL}/games/${game.slug}`,
    lastModified: new Date(game.lastmod || "2026-11-14"),
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...guideRoutes, ...gameRoutes];
}
