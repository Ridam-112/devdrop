# DevDrop — AI Search (GEO) & Generative Citability Audit

> **Framework:** AgriciDaniel/claude-seo (Generative Engine Optimization & AI Citability Guidelines)  
> **Target Surfaces:** Google AI Overviews, ChatGPT Search, Perplexity, Gemini, Claude Search  
> **Target Domain:** `https://devdrop.online`  
> **Audit Date:** November 2026  

## 1. Executive Summary

Under modern 2026 Generative Engine Optimization (GEO) standards, AI search engines prioritize pages with **high information gain, self-contained answer blocks in the top 30% of HTML, clear entity definition, and unobstructed crawler access**. DevDrop has been audited and enhanced to maximize citations across all major AI search surfaces for both cybersecurity developer tools and online open-source HTML5 browser games.

## 2. Target Query Domination Strategy

### Target Query: *"online open source html 5 game"*
- **Primary Hub:** `https://devdrop.online/games`
- **Individual Game Landers:** 12 dedicated static routes under `/games/[gameSlug]`
- **Search Intent:** Informational + Transactional/Playable (Immediate in-browser execution)
- **Information Gain Score:** High (Direct playable HTML5 Canvas games embedded + GitHub source code links + verified metadata from `bobeff/open-source-games`)
- **Entity Verification:** `VideoGame` and `ItemList` Schema.org JSON-LD structured data with zero-price offers.

## 3. AI Crawler Permissions Matrix

| Crawler Token | Platform | Purpose | Access Status | Citability Impact |
| :--- | :--- | :--- | :---: | :--- |
| `Googlebot` | Google | Search & AI Overviews | **Allowed** | Core Google AI Overview inclusion |
| `OAI-SearchBot` | OpenAI | ChatGPT Search Index | **Allowed** | Direct citation in ChatGPT Search answers |
| `ChatGPT-User` | OpenAI | Live User Browsing | **Allowed** | Real-time page summaries via ChatGPT |
| `Claude-SearchBot` | Anthropic | Claude Search Index | **Allowed** | Live citation in Claude Search responses |
| `PerplexityBot` | Perplexity | Perplexity AI Search | **Allowed** | Direct footnotes in Perplexity search results |
| `Bingbot` | Microsoft | Copilot & Bing Index | **Allowed** | Copilot grounded answers |

## 4. Direct Answer & Citability Architecture

According to empirical GEO studies (SE Ranking / Ahrefs), **over 44% of AI citations are extracted from the first 30% of a document**.

- **Front-Loaded Answer Blocks:** Both the `/games` hub and all individual `/games/[slug]` pages lead with self-contained 130–160 word summaries explaining the game genre, open-source license, and browser compatibility.
- **Structured Q&A Passages:** Technical FAQ modules marked with `FAQPage` schema provide quotation snippets for answer engines.
- **llms.txt Standard:** Published at `https://devdrop.online/llms.txt` mapping all tools and games in clean Markdown.

