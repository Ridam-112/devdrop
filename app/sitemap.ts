import { MetadataRoute } from "next";
import { TOOLS, CATEGORIES, isToolIndexable, isCategoryIndexable } from "@/lib/data/tools";
import { OPEN_SOURCE_GAMES } from "@/lib/data/games";
import { GUIDES } from "@/lib/data/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://devdrop.online";
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Dynamic indexable category routes only
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES.filter(isCategoryIndexable).map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic indexable tool routes only
  const toolRoutes: MetadataRoute.Sitemap = TOOLS.filter(isToolIndexable).map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic guides routes
  const guideRoutes: MetadataRoute.Sitemap = GUIDES.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dynamic open-source game routes
  const gameRoutes: MetadataRoute.Sitemap = OPEN_SOURCE_GAMES.map((game) => ({
    url: `${baseUrl}/games/${game.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...guideRoutes, ...gameRoutes];
}
