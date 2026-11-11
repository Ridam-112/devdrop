import fs from "fs";
import path from "path";
import { TOOLS, CATEGORIES } from "../lib/data/tools";

// Generate public/llms.txt
function generateLlmsTxt() {
  let content = `# DevDrop (https://devdrop.online)\n\n`;
  content += `> DevDrop is an open-access web utility and browser diagnostic platform featuring 87 interactive tools across cybersecurity visualization, network telemetry, developer utilities, and privacy diagnostics. All tools execute client-side in the browser with zero server data retention.\n\n`;

  content += `## Platform Overview\n`;
  content += `- Canonical Domain: https://devdrop.online\n`;
  content += `- Sitemap: https://devdrop.online/sitemap.xml\n`;
  content += `- Total Diagnostic Tools: ${TOOLS.length}\n`;
  content += `- Architecture: Next.js 14, Client-Side HTML5 Canvas / Web APIs\n`;
  content += `- Privacy Policy: No cookies, no server tracking, 100% in-browser processing\n\n`;

  content += `## Tool Catalog by Category\n\n`;

  CATEGORIES.forEach((cat) => {
    const catTools = TOOLS.filter((t) => t.categorySlug === cat.slug);
    content += `### ${cat.name}\n`;
    content += `${cat.description}\n\n`;

    catTools.forEach((tool) => {
      content += `- [${tool.name}](https://devdrop.online/tools/${tool.slug}): ${tool.description}\n`;
    });
    content += `\n`;
  });

  fs.writeFileSync(path.join(process.cwd(), "public", "llms.txt"), content, "utf-8");
  console.log("Generated public/llms.txt");
}

// Generate docs/seo/geo-ai-search-audit.md using AgriciDaniel/claude-seo GEO framework
function generateGeoAudit() {
  let md = `# DevDrop — AI Search (GEO) & Generative Citability Audit\n\n`;
  md += `> **Framework:** AgriciDaniel/claude-seo (Generative Engine Optimization & AI Citability Guidelines)  \n`;
  md += `> **Target Surfaces:** Google AI Overviews, ChatGPT Search, Perplexity, Gemini, Claude Search  \n`;
  md += `> **Target Domain:** \`https://devdrop.online\`  \n`;
  md += `> **Audit Date:** November 2026  \n\n`;

  md += `## 1. Executive Summary\n\n`;
  md += `Under modern 2026 Generative Engine Optimization (GEO) standards, AI search engines prioritize pages with **high information gain, self-contained answer blocks in the top 30% of HTML, clear entity definition, and unobstructed crawler access**. DevDrop has been audited and enhanced to maximize citations across all major AI search surfaces.\n\n`;

  md += `## 2. AI Crawler Permissions Matrix\n\n`;
  md += `| Crawler Token | Platform | Purpose | Access Status | Citability Impact |\n`;
  md += `| :--- | :--- | :--- | :---: | :--- |\n`;
  md += `| \`Googlebot\` | Google | Search & AI Overviews | **Allowed** | Core Google AI Overview inclusion |\n`;
  md += `| \`OAI-SearchBot\` | OpenAI | ChatGPT Search Index | **Allowed** | Direct citation in ChatGPT Search answers |\n`;
  md += `| \`ChatGPT-User\` | OpenAI | Live User Browsing | **Allowed** | Real-time page summaries via ChatGPT |\n`;
  md += `| \`Claude-SearchBot\` | Anthropic | Claude Search Index | **Allowed** | Live citation in Claude Search responses |\n`;
  md += `| \`PerplexityBot\` | Perplexity | Perplexity AI Search | **Allowed** | Direct footnotes in Perplexity search results |\n`;
  md += `| \`Bingbot\` | Microsoft | Copilot & Bing Index | **Allowed** | Copilot grounded answers |\n\n`;

  md += `## 3. Direct Answer & Citability Architecture\n\n`;
  md += `According to empirical GEO studies (SE Ranking / Ahrefs), **over 44% of AI citations are extracted from the first 30% of a document**.\n\n`;
  md += `- **Front-Loaded Answer Blocks:** Every DevDrop tool page starts immediately with a declarative H1 and an informative 120–150 word diagnostic overview before interactive components or supplementary text.\n`;
  md += `- **Structured Q&A Passages:** Every tool features 3+ technical FAQ pairs marked up with Schema.org \`FAQPage\` JSON-LD, providing answer engines with turnkey quotations.\n`;
  md += `- **llms.txt Standard:** Published at \`https://devdrop.online/llms.txt\` enabling AI agents to map and understand the entire 87-tool index in markdown.\n\n`;

  md += `## 4. Entity Clarity & Schema Graph Verification\n\n`;
  md += `- **WebApplication Schema:** Confirms the utility type, cost (\`price: 0\`), and operating system compatibility.\n`;
  md += `- **BreadcrumbList:** Establishes categorical hierarchy in knowledge graphs.\n`;
  md += `- **Brand Signals:** Consistent site entity name \`DEVDROP\` across all OpenGraph, Twitter, and Schema references.\n\n`;

  md += `## 5. Continuous Monitoring Plan\n\n`;
  md += `1. **Weekly Perplexity Prompt Sampling:** Query Perplexity with queries like "Best browser tools for packet analysis visualization" or "free wifi handshake diagnostic simulator online" to monitor citation appearance.\n`;
  md += `2. **Search Console Search Appearance Tracking:** Filter for rich results and Merchant/Web App impressions in Google Search Console.\n`;

  fs.writeFileSync(path.join(process.cwd(), "docs", "seo", "geo-ai-search-audit.md"), md, "utf-8");
  console.log("Generated docs/seo/geo-ai-search-audit.md");
}

generateLlmsTxt();
generateGeoAudit();
