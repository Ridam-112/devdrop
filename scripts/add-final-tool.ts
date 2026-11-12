import fs from "fs";
import path from "path";
import { TOOLS, CATEGORIES } from "../lib/data/tools";

const extraTools = [
  {
    slug: "markdown-table-generator",
    aliases: ["md-table-builder", "markdown-grid-maker"],
    name: "Markdown Table Generator",
    h1: "Markdown Table Generator: Create & Format Clean Markdown Tables Online",
    tagline: "Visual table builder with columns, rows, alignment, and instant Markdown output",
    categorySlug: "developer-utils",
    iconName: "Sliders",
    badge: "Utility",
    isPopular: false,
    shortIntro: "Design and format GitHub-flavored Markdown tables with visual rows and columns. Configure alignment and copy clean Markdown syntax.",
    description: "Design and format GitHub-flavored Markdown tables with visual rows and columns.",
    longDescription: "Create clean Markdown tables effortlessly. Set row and column counts, adjust cell alignments (left, center, right), and copy formatted Markdown code ready for documentation.",
    features: ["Interactive row and column editor", "Column alignment controls", "Instant Markdown syntax output"],
    limitations: ["Operates within local browser memory."],
    disclaimer: "No data stored on servers.",
    howItWorks: ["Edit table cells and copy generated Markdown."],
    faqs: [{ question: "Is this Markdown table format GitHub compatible?", answer: "Yes, it follows GitHub Flavored Markdown (GFM) table specifications." }],
    relatedSlugs: ["markdown-previewer", "word-counter", "json-to-csv-converter"],
    metaTitle: "Markdown Table Generator — Visual Markdown Table Builder | DEVDROP",
    metaDescription: "Create and format Markdown tables visually online for free. Custom columns, rows, alignment, and instant GFM code output.",
    canonicalPath: "/tools/markdown-table-generator"
  },
  {
    slug: "html-to-markdown-converter",
    aliases: ["html2md", "convert-html-markdown"],
    name: "HTML to Markdown Converter",
    h1: "HTML to Markdown Converter: Convert HTML Code to Clean Markdown Syntax",
    tagline: "Transform raw HTML headings, lists, tables, and links into clean Markdown text",
    categorySlug: "developer-utils",
    iconName: "FileCode",
    badge: "Utility",
    isPopular: false,
    shortIntro: "Convert messy HTML markup into clean, readable Markdown syntax. Preserves headers, bold, italics, code blocks, lists, and links.",
    description: "Convert raw HTML markup into clean, readable Markdown syntax.",
    longDescription: "Easily convert web articles, HTML documentation, and formatted code snippets into clean Markdown format ready for blogs, README files, and documentation engines.",
    features: ["Converts headings, lists, links, images, and tables", "Clean formatted output", "1-click copy"],
    limitations: ["Operates on standard HTML elements."],
    disclaimer: "Client-side processing.",
    howItWorks: ["Paste HTML and copy formatted Markdown."],
    faqs: [{ question: "Does this handle nested lists?", answer: "Yes, standard nested ordered and unordered lists are converted into indented Markdown lists." }],
    relatedSlugs: ["markdown-previewer", "markdown-table-generator", "html-entity-encoder"],
    metaTitle: "HTML to Markdown Converter — Free HTML to MD Tool | DEVDROP",
    metaDescription: "Convert HTML markup to clean Markdown syntax online for free. Convert headings, lists, links, and tables with instant copy.",
    canonicalPath: "/tools/html-to-markdown-converter"
  }
];

for (const t of extraTools) {
  if (!TOOLS.some(x => x.slug === t.slug)) {
    TOOLS.push(t as any);
  }
}

const outContent = `export interface ToolFaq {
  question: string;
  answer: string;
}

export interface CategoryFaq {
  question: string;
  answer: string;
}

export interface ToolCategory {
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  longDescription: string;
  iconName: string;
  faqs: CategoryFaq[];
}

export interface ToolItem {
  slug: string;
  aliases?: string[];
  name: string;
  h1: string;
  tagline: string;
  categorySlug: string;
  iconName: string;
  shortIntro: string;
  description: string;
  longDescription: string;
  features: string[];
  limitations: string[];
  disclaimer: string;
  howItWorks: string[];
  faqs: ToolFaq[];
  relatedSlugs: string[];
  badge?: string;
  isPopular?: boolean;
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
}

export const CATEGORIES: ToolCategory[] = ${JSON.stringify(CATEGORIES, null, 2)};

export const TOOLS: ToolItem[] = ${JSON.stringify(TOOLS, null, 2)};
`;

fs.writeFileSync(path.resolve(__dirname, "../lib/data/tools.ts"), outContent, "utf8");
console.log("Updated Tools Count:", TOOLS.length);
