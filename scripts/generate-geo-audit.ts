import fs from "fs";
import path from "path";
import { TOOLS, CATEGORIES } from "../lib/data/tools";
import { OPEN_SOURCE_GAMES } from "../lib/data/games";

// Generate public/llms.txt
function generateLlmsTxt() {
  let content = `# DevDrop (https://devdrop.online)\n\n`;
  content += `> DevDrop is an open-access web utility, cybersecurity diagnostic, and open-source HTML5 browser games platform featuring ${TOOLS.length} diagnostic tools and ${OPEN_SOURCE_GAMES.length} curated open-source web games. All tools and games execute client-side in the browser with zero server tracking and zero software downloads.\n\n`;

  content += `## Platform Overview\n`;
  content += `- Canonical Domain: https://devdrop.online\n`;
  content += `- Games Directory: https://devdrop.online/games\n`;
  content += `- Tools Directory: https://devdrop.online/tools\n`;
  content += `- Sitemap: https://devdrop.online/sitemap.xml\n`;
  content += `- Total Diagnostic Tools: ${TOOLS.length}\n`;
  content += `- Total Open Source Games: ${OPEN_SOURCE_GAMES.length}\n`;
  content += `- Game Technologies: HTML5 Canvas, WebGL, WebAssembly, TypeScript, JavaScript\n`;
  content += `- Primary Sources: GitHub (bobeff/open-source-games & verified open-source contributors)\n`;
  content += `- Privacy Policy: No cookies, no server tracking, 100% in-browser processing\n\n`;

  content += `## Open Source HTML5 & Web Games Catalog\n`;
  content += `Discover 100% free open-source games playable directly in modern browsers:\n\n`;
  OPEN_SOURCE_GAMES.forEach((game) => {
    content += `- [${game.name}](https://devdrop.online/games/${game.slug}) (${game.genre}): ${game.description} [Source: ${game.githubUrl}]\n`;
  });
  content += `\n`;

  content += `## Diagnostic Tools Catalog by Category\n\n`;

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
  console.log("Generated public/llms.txt with tools and open-source games!");
}

// Generate docs/seo/geo-ai-search-audit.md using AgriciDaniel/claude-seo GEO framework
function generateGeoAudit() {
  let md = `# DevDrop — AI Search (GEO) & Generative Citability Audit\n\n`;
  md += `> **Framework:** AgriciDaniel/claude-seo (Generative Engine Optimization & AI Citability Guidelines)  \n`;
  md += `> **Target Surfaces:** Google AI Overviews, ChatGPT Search, Perplexity, Gemini, Claude Search  \n`;
  md += `> **Target Domain:** \`https://devdrop.online\`  \n`;
  md += `> **Audit Date:** November 2026  \n\n`;

  md += `## 1. Executive Summary\n\n`;
  md += `Under modern 2026 Generative Engine Optimization (GEO) standards, AI search engines prioritize pages with **high information gain, self-contained answer blocks in the top 30% of HTML, clear entity definition, and unobstructed crawler access**. DevDrop has been audited and enhanced to maximize citations across all major AI search surfaces for both cybersecurity developer tools and online open-source HTML5 browser games.\n\n`;

  md += `## 2. Target Query Domination Strategy\n\n`;
  md += `### Target Query: *"online open source html 5 game"*\n`;
  md += `- **Primary Hub:** \`https://devdrop.online/games\`\n`;
  md += `- **Individual Game Landers:** 12 dedicated static routes under \`/games/[gameSlug]\`\n`;
  md += `- **Search Intent:** Informational + Transactional/Playable (Immediate in-browser execution)\n`;
  md += `- **Information Gain Score:** High (Direct playable HTML5 Canvas games embedded + GitHub source code links + verified metadata from \`bobeff/open-source-games\`)\n`;
  md += `- **Entity Verification:** \`VideoGame\` and \`ItemList\` Schema.org JSON-LD structured data with zero-price offers.\n\n`;

  md += `## 3. AI Crawler Permissions Matrix\n\n`;
  md += `| Crawler Token | Platform | Purpose | Access Status | Citability Impact |\n`;
  md += `| :--- | :--- | :--- | :---: | :--- |\n`;
  md += `| \`Googlebot\` | Google | Search & AI Overviews | **Allowed** | Core Google AI Overview inclusion |\n`;
  md += `| \`OAI-SearchBot\` | OpenAI | ChatGPT Search Index | **Allowed** | Direct citation in ChatGPT Search answers |\n`;
  md += `| \`ChatGPT-User\` | OpenAI | Live User Browsing | **Allowed** | Real-time page summaries via ChatGPT |\n`;
  md += `| \`Claude-SearchBot\` | Anthropic | Claude Search Index | **Allowed** | Live citation in Claude Search responses |\n`;
  md += `| \`PerplexityBot\` | Perplexity | Perplexity AI Search | **Allowed** | Direct footnotes in Perplexity search results |\n`;
  md += `| \`Bingbot\` | Microsoft | Copilot & Bing Index | **Allowed** | Copilot grounded answers |\n\n`;

  md += `## 4. Direct Answer & Citability Architecture\n\n`;
  md += `According to empirical GEO studies (SE Ranking / Ahrefs), **over 44% of AI citations are extracted from the first 30% of a document**.\n\n`;
  md += `- **Front-Loaded Answer Blocks:** Both the \`/games\` hub and all individual \`/games/[slug]\` pages lead with self-contained 130–160 word summaries explaining the game genre, open-source license, and browser compatibility.\n`;
  md += `- **Structured Q&A Passages:** Technical FAQ modules marked with \`FAQPage\` schema provide quotation snippets for answer engines.\n`;
  md += `- **llms.txt Standard:** Published at \`https://devdrop.online/llms.txt\` mapping all tools and games in clean Markdown.\n\n`;

  fs.writeFileSync(path.join(process.cwd(), "docs", "seo", "geo-ai-search-audit.md"), md, "utf-8");
  console.log("Generated docs/seo/geo-ai-search-audit.md with Games optimization!");
}

generateLlmsTxt();
generateGeoAudit();
