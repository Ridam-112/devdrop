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

const baseUrl = 'https://devdrop.online';
const now = new Date().toISOString();

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/tools', priority: '0.9', changefreq: 'daily' },
  { path: '/games', priority: '0.95', changefreq: 'daily' },
  { path: '/guides', priority: '0.85', changefreq: 'weekly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
  { path: '/disclaimer', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.4', changefreq: 'monthly' },
  { path: '/terms', priority: '0.4', changefreq: 'monthly' },
];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

staticRoutes.forEach(r => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}${r.path}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
  xml += `    <priority>${r.priority}</priority>\n`;
  xml += '  </url>\n';
});

indexableCategories.forEach(cat => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.8</priority>\n';
  xml += '  </url>\n';
});

indexableTools.forEach(tool => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/tools/${tool.slug}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.85</priority>\n';
  xml += '  </url>\n';
});

guides.forEach(guide => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/guides/${guide.slug}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>monthly</changefreq>\n';
  xml += '    <priority>0.8</priority>\n';
  xml += '  </url>\n';
});

games.forEach(game => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/games/${game.slug}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.9</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`Generated public/sitemap.xml with ${staticRoutes.length} static, ${indexableCategories.length} categories, ${indexableTools.length} tools, ${guides.length} guides, and ${games.length} games.`);

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
console.log('Generated public/robots.txt with canonical host and sitemap link.');
