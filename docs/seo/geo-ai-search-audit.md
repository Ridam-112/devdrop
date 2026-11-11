# DevDrop — AI Search (GEO) & Generative Citability Audit

> **Framework:** AgriciDaniel/claude-seo (Generative Engine Optimization & AI Citability Guidelines)  
> **Target Surfaces:** Google AI Overviews, ChatGPT Search, Perplexity, Gemini, Claude Search  
> **Target Domain:** `https://devdrop.online`  
> **Audit Date:** November 2026  

## 1. Executive Summary

Under modern 2026 Generative Engine Optimization (GEO) standards, AI search engines prioritize pages with **high information gain, self-contained answer blocks in the top 30% of HTML, clear entity definition, and unobstructed crawler access**. DevDrop has been audited and enhanced to maximize citations across all major AI search surfaces.

## 2. AI Crawler Permissions Matrix

| Crawler Token | Platform | Purpose | Access Status | Citability Impact |
| :--- | :--- | :--- | :---: | :--- |
| `Googlebot` | Google | Search & AI Overviews | **Allowed** | Core Google AI Overview inclusion |
| `OAI-SearchBot` | OpenAI | ChatGPT Search Index | **Allowed** | Direct citation in ChatGPT Search answers |
| `ChatGPT-User` | OpenAI | Live User Browsing | **Allowed** | Real-time page summaries via ChatGPT |
| `Claude-SearchBot` | Anthropic | Claude Search Index | **Allowed** | Live citation in Claude Search responses |
| `PerplexityBot` | Perplexity | Perplexity AI Search | **Allowed** | Direct footnotes in Perplexity search results |
| `Bingbot` | Microsoft | Copilot & Bing Index | **Allowed** | Copilot grounded answers |

## 3. Direct Answer & Citability Architecture

According to empirical GEO studies (SE Ranking / Ahrefs), **over 44% of AI citations are extracted from the first 30% of a document**.

- **Front-Loaded Answer Blocks:** Every DevDrop tool page starts immediately with a declarative H1 and an informative 120–150 word diagnostic overview before interactive components or supplementary text.
- **Structured Q&A Passages:** Every tool features 3+ technical FAQ pairs marked up with Schema.org `FAQPage` JSON-LD, providing answer engines with turnkey quotations.
- **llms.txt Standard:** Published at `https://devdrop.online/llms.txt` enabling AI agents to map and understand the entire 87-tool index in markdown.

## 4. Entity Clarity & Schema Graph Verification

- **WebApplication Schema:** Confirms the utility type, cost (`price: 0`), and operating system compatibility.
- **BreadcrumbList:** Establishes categorical hierarchy in knowledge graphs.
- **Brand Signals:** Consistent site entity name `DEVDROP` across all OpenGraph, Twitter, and Schema references.

## 5. Continuous Monitoring Plan

1. **Weekly Perplexity Prompt Sampling:** Query Perplexity with queries like "Best browser tools for packet analysis visualization" or "free wifi handshake diagnostic simulator online" to monitor citation appearance.
2. **Search Console Search Appearance Tracking:** Filter for rich results and Merchant/Web App impressions in Google Search Console.
