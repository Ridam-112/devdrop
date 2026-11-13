const fs = require('fs');

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

const toolsContent = fs.readFileSync('lib/data/tools.ts', 'utf8');
const gamesContent = fs.readFileSync('lib/data/games.ts', 'utf8');
const guidesContent = fs.readFileSync('lib/data/guides.ts', 'utf8');

// Extract categories
const catMatch = toolsContent.match(/export const CATEGORIES: ToolCategory\[\] = (\[[\s\S]*?\]);/);
// Extract tools
const toolMatch = toolsContent.match(/export const TOOLS: ToolItem\[\] = (\[[\s\S]*?\]);/);
// Extract games
const gamesMatch = gamesContent.match(/export const OPEN_SOURCE_GAMES: OpenSourceGame\[\] = (\[[\s\S]*?\]);/);
// Extract guides
const guidesMatch = guidesContent.match(/export const GUIDES: GuideItem\[\] = (\[[\s\S]*?\]);/);

let categories = [];
let tools = [];
let games = [];
let guides = [];

try {
  categories = eval(catMatch[1]);
  tools = eval(toolMatch[1]);
  games = eval(gamesMatch[1]);
  guides = eval(guidesMatch[1]);
} catch (e) {
  console.error('Eval error:', e);
}

// Filter to indexable only
const indexableCategories = categories.filter(c => c.indexable !== false);
const indexableTools = tools.filter(t => {
  if (t.indexable !== undefined) return t.indexable;
  const parentCat = categories.find(c => c.slug === t.categorySlug);
  return parentCat ? parentCat.indexable !== false : false;
});
const indexableGames = games.filter(g => g.indexable === true);

const baseUrl = 'https://devdrop.online';

const staticRoutes = [
  { path: '', lastmod: '2026-11-13' },
  { path: '/tools', lastmod: '2026-11-13' },
  { path: '/games', lastmod: '2026-11-10' },
  { path: '/guides', lastmod: '2026-11-09' },
  { path: '/about', lastmod: '2026-11-12' },
  { path: '/contact', lastmod: '2026-11-10' },
  { path: '/disclaimer', lastmod: '2026-11-01' },
  { path: '/privacy', lastmod: '2026-11-13' },
  { path: '/terms', lastmod: '2026-10-25' },
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Static routes
staticRoutes.forEach(r => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}${r.path}</loc>\n`;
  xml += `    <lastmod>${r.lastmod}</lastmod>\n`;
  xml += '  </url>\n';
});

// Categories (indexable only)
indexableCategories.forEach(cat => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
  xml += `    <lastmod>2026-11-10</lastmod>\n`;
  xml += '  </url>\n';
});

// Tools (indexable only)
indexableTools.forEach(tool => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/tools/${tool.slug}</loc>\n`;
  xml += `    <lastmod>2026-11-10</lastmod>\n`;
  xml += '  </url>\n';
});

// Guides (with real per-guide publication dates)
guides.forEach(guide => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/guides/${guide.slug}</loc>\n`;
  xml += `    <lastmod>${guide.publishedAt || '2026-11-05'}</lastmod>\n`;
  xml += '  </url>\n';
});

// Games (best 20 indexable only, with per-game lastmod)
indexableGames.forEach(game => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/games/${game.slug}</loc>\n`;
  xml += `    <lastmod>${game.lastmod || '2026-11-05'}</lastmod>\n`;
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`Generated public/sitemap.xml with ${staticRoutes.length} static, ${indexableCategories.length} categories, ${indexableTools.length} tools, ${guides.length} guides, and ${indexableGames.length} games (NO priority/changefreq).`);

// robots.txt: Crawlable for all agents, does NOT disallow noindex paths so Googlebot can discover the noindex header/meta tags
const robots = `User-agent: *
Allow: /
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://devdrop.online/sitemap.xml
Host: https://devdrop.online
`;

fs.writeFileSync('public/robots.txt', robots, 'utf8');
console.log('Generated public/robots.txt with Allow: / and sitemap link.');
