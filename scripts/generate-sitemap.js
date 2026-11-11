const fs = require('fs');

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

const content = fs.readFileSync('lib/data/tools.ts', 'utf8');

// Extract categories
const catMatch = content.match(/export const CATEGORIES: ToolCategory\[\] = (\[[\s\S]*?\]);/);
// Extract tools
const toolMatch = content.match(/export const TOOLS: ToolItem\[\] = (\[[\s\S]*?\]);/);

let categories = [];
let tools = [];

try {
  categories = eval(catMatch[1]);
  tools = eval(toolMatch[1]);
} catch (e) {
  console.error('Eval error:', e);
}

const baseUrl = 'https://devdrop.online';
const now = new Date().toISOString();

const staticRoutes = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: '/tools', priority: '0.9', changefreq: 'daily' },
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

categories.forEach(cat => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/category/${cat.slug}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.8</priority>\n';
  xml += '  </url>\n';
});

tools.forEach(tool => {
  xml += '  <url>\n';
  xml += `    <loc>${baseUrl}/tools/${tool.slug}</loc>\n`;
  xml += `    <lastmod>${now}</lastmod>\n`;
  xml += '    <changefreq>weekly</changefreq>\n';
  xml += '    <priority>0.85</priority>\n';
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');

const robots = `User-agent: *
Allow: /

Sitemap: https://devdrop.online/sitemap.xml
`;

fs.writeFileSync('public/robots.txt', robots, 'utf8');

console.log('Generated public/sitemap.xml with', staticRoutes.length + categories.length + tools.length, 'URLs!');
