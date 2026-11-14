"use client";

import React, { useState, useId } from "react";
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Laptop,
  Tablet,
  Smartphone,
  Eye,
  Code2,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  FolderGit2,
  Wrench,
  FileCode,
  RotateCcw,
  CheckCircle2,
  Share2
} from "lucide-react";

interface ExperienceItem {
  id: string;
  role: string;
  when: string;
  desc: string;
  highlights: string;
}

interface ProjectItem {
  id: string;
  title: string;
  link: string;
  desc: string;
  tags: string;
}

interface SkillGroup {
  id: string;
  title: string;
  items: string;
}

interface PortfolioData {
  name: string;
  role: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  aboutHeadline: string;
  aboutParagraph: string;
  theme: "system" | "light" | "dark";
  featuredProject: {
    title: string;
    link: string;
    description: string;
    tech: string;
    stats: string;
  };
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
}

const DEFAULT_DATA: PortfolioData = {
  name: "Alex Sharma",
  role: "Full-Stack Developer & UI Engineer",
  tagline: "I engineer high-performance web apps and modern user interfaces.",
  email: "alex@example.com",
  phone: "+91 98765 43210",
  location: "Kolkata, India",
  github: "https://github.com/alexsharma",
  linkedin: "https://linkedin.com/in/alexsharma",
  instagram: "",
  twitter: "https://x.com/alexsharma_dev",
  aboutHeadline: "Transforming ambitious ideas into scalable digital products",
  aboutParagraph:
    "I'm a full-stack developer with 4+ years of hands-on experience building fast, accessible web applications and developer tools. Passionate about clean architecture, responsive layouts, 60 FPS animations, and privacy-first software engineering.",
  theme: "dark",
  featuredProject: {
    title: "CloudVault Storage Engine",
    link: "https://example.com/cloudvault",
    description:
      "A client-side encrypted decentralized file storage solution with instant multi-device peer transfer, zero server telemetry, and WebAssembly compression.",
    tech: "TypeScript, React, WebAssembly, WebRTC, Tailwind CSS",
    stats: "15K+ | Active Users\n99.98% | Uptime\n<50ms | Sync Latency"
  },
  experiences: [
    {
      id: "exp-1",
      role: "Senior Frontend Engineer",
      when: "NexGen Labs · 2023 — Present",
      desc: "Leading architecture of high-traffic SaaS interfaces, improving Core Web Vitals score from 68 to 98 across 5 core products.",
      highlights: "Reduced bundle size by 42%\nArchitected real-time WebSocket dashboard\nMentored 6 junior engineers"
    },
    {
      id: "exp-2",
      role: "Full-Stack Developer",
      when: "VentureCraft Studio · 2021 — 2023",
      desc: "Built 12+ bespoke web applications for international startups, integrating Stripe billing, headless CMS, and edge deployments.",
      highlights: "Shipped 12 production apps\nIntegrated zero-downtime CI/CD\n100% test coverage on billing APIs"
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "DevSprint Task Engine",
      link: "https://github.com/example/devsprint",
      desc: "Lightweight offline-first Kanban board with real-time IndexedDB synchronization and keyboard shortcuts.",
      tags: "React, TypeScript, IndexedDB, Tailwind CSS"
    },
    {
      id: "proj-2",
      title: "PixelForge Image API",
      link: "https://github.com/example/pixelforge",
      desc: "Browser-based batch image optimization, format conversion (WebP/AVIF), and EXIF scrubbing engine.",
      tags: "Canvas 2D, Web Workers, Rust (Wasm)"
    }
  ],
  skills: [
    {
      id: "sk-1",
      title: "Frontend Engineering",
      items: "React, Next.js, TypeScript, Tailwind CSS, Three.js, Canvas 2D, Redux Toolkit"
    },
    {
      id: "sk-2",
      title: "Backend & Cloud",
      items: "Node.js, Express, Python, PostgreSQL, Redis, Docker, Vercel, AWS S3"
    },
    {
      id: "sk-3",
      title: "Developer Tools & Testing",
      items: "Git, Jest, Playwright, Vite, Webpack, Figma, CI/CD GitHub Actions"
    }
  ]
};

function escapeHtml(str: string): string {
  return String(str || "").replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

function normalizeUrl(u: string): string {
  if (!u) return "";
  if (/^(https?:|mailto:|tel:)/i.test(u)) return u;
  return "https://" + u;
}

function buildExportHtml(d: PortfolioData): string {
  const firstName = escapeHtml(d.name.trim().split(" ")[0] || "Portfolio");
  const navItems = [
    ["home", "Home"],
    ["about", "About"]
  ];
  if (d.experiences.length) navItems.push(["experience", "Experience"]);
  if (d.featuredProject.title || d.projects.length) navItems.push(["projects", "Projects"]);
  if (d.skills.length) navItems.push(["skills", "Skills"]);
  navItems.push(["contact", "Contact"]);

  const themeAttr = d.theme === "system" ? "" : ` data-theme="${d.theme}"`;

  const css = `
:root {
  --bg: #fafafa;
  --fg: #111111;
  --mute: #666666;
  --line: #e5e5e5;
  --card: #ffffff;
  --ink: #0d0d0d;
  --g1: #1a1a1a;
  --g2: #4a4a4a;
  --g3: #8e8e8e;
  --g4: #d0d0d0;
  box-sizing: border-box;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #090b10;
    --fg: #f2f5f9;
    --mute: #8e9bb0;
    --line: #1c2333;
    --card: #121824;
    --ink: #05070a;
    --g1: #ffffff;
    --g2: #c4d1e6;
    --g3: #7b8fa8;
    --g4: #3d4b60;
  }
}
:root[data-theme="dark"] {
  --bg: #090b10;
  --fg: #f2f5f9;
  --mute: #8e9bb0;
  --line: #1c2333;
  --card: #121824;
  --ink: #05070a;
  --g1: #ffffff;
  --g2: #c4d1e6;
  --g3: #7b8fa8;
  --g4: #3d4b60;
}
:root[data-theme="light"] {
  --bg: #fafafa;
  --fg: #111111;
  --mute: #666666;
  --line: #e5e5e5;
  --card: #ffffff;
  --ink: #0d0d0d;
  --g1: #1a1a1a;
  --g2: #4a4a4a;
  --g3: #8e8e8e;
  --g4: #d0d0d0;
}
*, *::before, *::after { box-sizing: inherit; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--fg);
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: clip;
}
a { color: inherit; text-decoration: none; }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px); }
header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--bg);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px clamp(20px, 4vw, 48px);
  max-width: 1240px;
  margin: 0 auto;
  border-bottom: 1px solid var(--line);
}
.logo {
  font-weight: 800;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 6px;
}
.logo i {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff66;
}
nav {
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--line);
  border-radius: 99px;
  background: var(--card);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--mute);
  text-transform: uppercase;
}
nav a { padding: 8px 16px; border-radius: 99px; transition: all 0.2s; }
nav a:hover { color: var(--fg); background: var(--line); }
.theme-btn {
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--fg);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: transform 0.2s;
}
.theme-btn:hover { transform: scale(1.08); }
@media (max-width: 768px) { nav { display: none; } }

/* Hero */
.hero { text-align: center; padding: clamp(48px, 8vw, 100px) 0 40px; }
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  border-radius: 99px;
  background: var(--card);
  border: 1px solid var(--line);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--mute);
  margin-bottom: 24px;
}
.hero-tag span { width: 6px; height: 6px; border-radius: 50%; background: #00ff66; display: inline-block; }
h1 {
  margin: 0;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 0.9;
  letter-spacing: -0.04em;
  font-size: clamp(42px, 9vw, 110px);
}
.gradient-text {
  display: block;
  background: linear-gradient(180deg, var(--g1) 0%, var(--g2) 40%, var(--g3) 70%, var(--g4) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 48px;
  text-align: left;
}
.hero-grid .right { text-align: right; }
.sub-meta {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mute);
  line-height: 1.8;
}
.circle-btn {
  display: inline-flex;
  width: 54px;
  height: 54px;
  border: 1px solid var(--line);
  background: var(--card);
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-top: 18px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.circle-btn:hover {
  transform: translateY(4px);
  background: var(--fg);
  color: var(--bg);
}
@media (max-width: 680px) {
  .hero-grid { grid-template-columns: 1fr; text-align: center; }
  .hero-grid .right { text-align: center; }
}

/* About 3D Expanding Card Section */
#about {
  min-height: 180vh;
  background: var(--ink);
  color: #ffffff;
  position: relative;
}
.stick {
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
#card {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 420px;
  max-width: 92vw;
  max-height: 82vh;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: radial-gradient(circle at 30% 20%, #1e2638, #05070c 80%);
  box-shadow: 0 30px 80px -20px rgba(0, 0, 0, 0.8);
}
#cin {
  position: absolute;
  inset: 0;
  padding: clamp(24px, 5vw, 48px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: 0;
}
#cin h3 {
  margin: 0;
  font-size: clamp(14px, 2vw, 22px);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: -0.01em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 16px;
  color: #00ff66;
}
#cin p {
  margin: 0;
  font-size: clamp(12px, 1.4vw, 16px);
  line-height: 1.8;
  color: #d1d9e6;
  max-width: 780px;
}
.title-overlay {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  z-index: 5;
}
.title-overlay b {
  font-size: clamp(54px, 12vw, 140px);
  font-weight: 800;
  line-height: 0.92;
  text-transform: uppercase;
  letter-spacing: -0.03em;
}
.scroll-hint {
  position: absolute;
  bottom: 6vh;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #8e9bb0;
  text-transform: uppercase;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Experience */
#experience {
  background: var(--ink);
  color: #ffffff;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
#stage {
  display: flex;
  height: 100%;
  align-items: center;
  width: max-content;
  will-change: transform;
}
.panel {
  flex: 0 0 100vw;
  padding: 0 clamp(24px, 8vw, 120px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.panel h2, .panel h3 {
  margin: 0 0 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  line-height: 0.95;
  font-size: clamp(34px, 6vw, 92px);
}
.experience-badge {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #00ff66;
  margin-bottom: 14px;
  font-weight: 700;
}
.panel p {
  max-width: 640px;
  color: #b0bfd6;
  line-height: 1.7;
  font-size: clamp(14px, 1.4vw, 18px);
  margin: 0;
}
.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  max-width: 860px;
  font-size: 13px;
  color: #e2e8f0;
  line-height: 1.5;
}
.metrics-row div {
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: #00ff66;
  width: 0;
  z-index: 10;
}
@media (max-width: 640px) { .metrics-row { grid-template-columns: 1fr; } }

/* Projects */
section.sec { padding: clamp(60px, 9vw, 110px) 0; }
h2.section-title {
  margin: 0 0 32px;
  font-size: clamp(28px, 5vw, 64px);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: -0.03em;
}
.featured-card {
  border: 1px solid var(--line);
  background: var(--card);
  border-radius: 28px;
  padding: clamp(24px, 5vw, 52px);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 40px;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
}
.featured-card h3 {
  margin: 0 0 12px;
  font-size: clamp(26px, 3.8vw, 44px);
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: -0.02em;
}
.featured-card p {
  color: var(--mute);
  line-height: 1.7;
  margin: 0 0 20px;
  font-size: 15px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  align-content: start;
}
.stats-grid div {
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 20px;
  background: var(--bg);
}
.stats-grid b {
  display: block;
  font-size: clamp(22px, 3vw, 36px);
  font-weight: 800;
  letter-spacing: -0.02em;
}
.stats-grid span {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--mute);
  font-weight: 600;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 24px;
}
.tag-list span {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid var(--line);
  border-radius: 99px;
  padding: 6px 14px;
  color: var(--mute);
  background: var(--bg);
}
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--fg);
  color: var(--bg);
  padding: 14px 28px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: transform 0.2s;
}
.action-btn:hover { transform: translateY(-2px); }
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 24px;
}
.project-card {
  border: 1px solid var(--line);
  background: var(--card);
  border-radius: 24px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
}
.project-card:hover {
  transform: translateY(-5px);
  border-color: var(--fg);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.15);
}
.project-card h4 {
  margin: 0;
  font-size: 20px;
  text-transform: uppercase;
  font-weight: 800;
}
.project-card p {
  margin: 0;
  color: var(--mute);
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
}
.project-card a {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
}
@media (max-width: 820px) { .featured-card { grid-template-columns: 1fr; } }

/* Skills Accordion */
details {
  border: 1px solid var(--line);
  background: var(--card);
  border-radius: 20px;
  padding: 20px 28px;
  margin-bottom: 14px;
  transition: all 0.25s;
}
details[open] {
  background: var(--ink);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}
summary {
  cursor: pointer;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
summary::-webkit-details-marker { display: none; }
summary::after { content: "+"; font-size: 20px; font-weight: 400; }
details[open] summary::after { content: "–"; }
details p {
  color: var(--mute);
  font-size: 14px;
  line-height: 1.8;
  margin: 16px 0 0;
}
details[open] p { color: #cbd5e1; }

/* Contact & Footer */
footer {
  background: var(--ink);
  color: #ffffff;
  text-align: center;
  padding: 90px 20px 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
footer h2 {
  margin: 0;
  font-size: clamp(52px, 12vw, 160px);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.95;
  background: linear-gradient(#ffffff, #94a3b8 50%, #334155);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.contact-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin: 40px 0 60px;
}
.contact-pills a {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 99px;
  padding: 12px 26px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #e2e8f0;
  transition: all 0.2s;
}
.contact-pills a:hover {
  border-color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
.contact-pills a.primary {
  background: #00ff66;
  color: #000000;
  border-color: #00ff66;
  font-weight: 800;
}
.contact-pills a.primary:hover {
  background: #05e65d;
}
.footer-copy {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 28px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64748b;
}
`;

  const js = `
(function() {
  var root = document.documentElement;
  try {
    var stored = localStorage.getItem('theme');
    if (stored) root.setAttribute('data-theme', stored);
  } catch(e) {}

  var tg = document.getElementById('tg');
  if (tg) {
    tg.onclick = function() {
      var current = root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch(e) {}
    };
  }

  function clamp(v) { return Math.max(0, Math.min(1, v)); }
  var ab = document.getElementById('about');
  var card = document.getElementById('card');
  var cin = document.getElementById('cin');
  var t1 = document.getElementById('t1');
  var t2 = document.getElementById('t2');
  var hint = document.getElementById('hint');
  var ex = document.getElementById('experience');
  var st = document.getElementById('stage');
  var bar = document.getElementById('bar');

  function getProgress(el) {
    var b = el.getBoundingClientRect();
    return clamp(-b.top / (el.offsetHeight - window.innerHeight));
  }

  function tick() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (ab && card && cin && t1 && t2) {
      var p = getProgress(ab);
      var targetW = Math.min(w * 0.92, 1200);
      var targetH = h * 0.82;
      card.style.width = (320 + (targetW - 320) * p) + 'px';
      card.style.height = (420 + (targetH - 420) * p) + 'px';
      var sp = Math.min(1, p * 1.6);
      t1.style.transform = 'translateX(' + (-sp * w * 0.55) + 'px)';
      t2.style.transform = 'translateX(' + (sp * w * 0.55) + 'px)';
      t1.style.opacity = String(1 - sp * 0.8);
      t2.style.opacity = String(1 - sp * 0.8);
      cin.style.opacity = String(clamp((p - 0.5) / 0.35));
      if (hint) hint.style.opacity = String(1 - clamp(p * 4));
    }

    if (ex && st && bar) {
      var e = getProgress(ex);
      ex.style.height = (st.children.length * 100) + 'vh';
      st.style.transform = 'translate3d(' + (-e * (st.scrollWidth - w)) + 'px, 0, 0)';
      bar.style.width = (e * 100) + '%';
    }
  }

  var scheduled = false;
  window.addEventListener('scroll', function() {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(function() {
        scheduled = false;
        tick();
      });
    }
  }, { passive: true });
  window.addEventListener('resize', tick);
  tick();
})();
`;

  let out = `<!DOCTYPE html>
<html lang="en"${themeAttr}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(d.name)} — ${escapeHtml(d.role)}</title>
<meta name="description" content="Portfolio of ${escapeHtml(d.name)}, ${escapeHtml(d.role)}. ${escapeHtml(d.tagline)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>${css}</style>
</head>
<body>
<header>
  <a class="logo" href="#home">${firstName}<i></i></a>
  <nav>${navItems.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}</nav>
  <button class="theme-btn" id="tg" aria-label="Toggle theme">◐</button>
</header>

<main id="home" class="wrap hero">
  <div class="hero-tag"><span></span> Available for new projects</div>
  <h1>Explore my <span class="gradient-text">Portfolio</span></h1>
  <div class="hero-grid">
    <div>
      <div class="sub-meta">${escapeHtml(d.role)}${d.location ? `<br>${escapeHtml(d.location)}` : ""}</div>
      <a class="circle-btn" href="#about" aria-label="Scroll down">↘</a>
    </div>
    <div class="right">
      <p class="sub-meta" style="max-width: 320px; margin: 0 0 20px auto;">
        ${escapeHtml(d.tagline || d.aboutHeadline)}
      </p>
      <div class="sub-meta">
        ${navItems.slice(2, -1).map(([id, label]) => `<a href="#${id}">${label}</a>`).join("<br>")}
      </div>
    </div>
  </div>
</main>

<section id="about">
  <div class="stick">
    <div id="card">
      <div id="cin">
        <h3>${escapeHtml(d.aboutHeadline)}</h3>
        <p>${escapeHtml(d.aboutParagraph).replace(/\n/g, "<br>")}</p>
      </div>
    </div>
    <div class="title-overlay">
      <b id="t1">About</b>
      <b id="t2">Me</b>
    </div>
    <div class="scroll-hint" id="hint">↓ Scroll to expand profile</div>
  </div>
</section>
`;

  if (d.experiences.length > 0) {
    out += `
<section id="experience">
  <div class="stick">
    <div class="progress-bar" id="bar"></div>
    <div id="stage">
      <div class="panel">
        <div class="experience-badge">Career Journey</div>
        <h2>Where<br>I’ve Been</h2>
        <p>A timeline of roles, milestones, and high-impact engineering accomplishments.</p>
      </div>
`;
    d.experiences.forEach((exp) => {
      const hlLines = exp.highlights.split("\n").map((x) => x.trim()).filter(Boolean).slice(0, 3);
      out += `      <div class="panel">
        <div class="experience-badge">${escapeHtml(exp.when)}</div>
        <h3>${escapeHtml(exp.role)}</h3>
        ${exp.desc ? `<p>${escapeHtml(exp.desc).replace(/\n/g, "<br>")}</p>` : ""}
        ${hlLines.length > 0 ? `<div class="metrics-row">${hlLines.map((h) => `<div>${escapeHtml(h)}</div>`).join("")}</div>` : ""}
      </div>
`;
    });
    out += `    </div>
  </div>
</section>
`;
  }

  if (d.featuredProject.title || d.projects.length > 0) {
    out += `
<section class="sec wrap" id="projects">
`;
    if (d.featuredProject.title) {
      const techList = d.featuredProject.tech.split(",").map((t) => t.trim()).filter(Boolean);
      const statLines = d.featuredProject.stats.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 6);
      out += `  <h2 class="section-title">Featured Project</h2>
  <div class="featured-card">
    <div>
      <h3>${escapeHtml(d.featuredProject.title)}</h3>
      <p>${escapeHtml(d.featuredProject.description).replace(/\n/g, "<br>")}</p>
      ${techList.length ? `<div class="tag-list">${techList.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>` : ""}
      ${d.featuredProject.link ? `<a class="action-btn" href="${escapeHtml(normalizeUrl(d.featuredProject.link))}" target="_blank" rel="noopener">Visit Project ↗</a>` : ""}
    </div>
    ${statLines.length ? `<div class="stats-grid">${statLines.map((l) => {
      const [val, lbl] = l.split("|");
      return `<div><b>${escapeHtml((val || "").trim())}</b><span>${escapeHtml((lbl || "").trim())}</span></div>`;
    }).join("")}</div>` : ""}
  </div>
`;
    }

    if (d.projects.length > 0) {
      out += `  <h2 class="section-title" style="margin-top: ${d.featuredProject.title ? "72px" : "0"};">${d.featuredProject.title ? "More Projects" : "Projects"}</h2>
  <div class="projects-grid">
`;
      d.projects.forEach((p) => {
        const pTags = p.tags.split(",").map((t) => t.trim()).filter(Boolean);
        out += `    <div class="project-card">
      <h4>${escapeHtml(p.title)}</h4>
      <p>${escapeHtml(p.desc).replace(/\n/g, "<br>")}</p>
      ${pTags.length ? `<div class="tag-list" style="margin: 4px 0 0;">${pTags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>` : ""}
      ${p.link ? `<a href="${escapeHtml(normalizeUrl(p.link))}" target="_blank" rel="noopener">View Project ↗</a>` : ""}
    </div>
`;
      });
      out += `  </div>
`;
    }
    out += `</section>
`;
  }

  if (d.skills.length > 0) {
    out += `
<section class="sec wrap" id="skills" style="max-width: 900px;">
  <h2 class="section-title" style="text-align: center;">Technical Toolkit</h2>
`;
    d.skills.forEach((sk, i) => {
      const items = sk.items.split(",").map((s) => s.trim()).filter(Boolean);
      out += `  <details${i === 0 ? " open" : ""}>
    <summary>${escapeHtml(sk.title)}</summary>
    <p>${items.map(escapeHtml).join(" • ")}</p>
  </details>
`;
    });
    out += `</section>
`;
  }

  const socialLinks: Array<[string, string]> = [
    [d.github, "GitHub"],
    [d.linkedin, "LinkedIn"],
    [d.twitter, "X / Twitter"],
    [d.instagram, "Instagram"]
  ];
  const activeSocials = socialLinks
    .filter(([u]) => Boolean(u.trim()))
    .map(([u, label]) => `<a href="${escapeHtml(normalizeUrl(u))}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`)
    .join("");

  out += `
<footer id="contact">
  <h2>Let’s Connect</h2>
  <div class="contact-pills">
    ${activeSocials}
    ${d.phone ? `<a href="tel:${escapeHtml(d.phone.replace(/[^+\d]/g, ""))}">Call ${escapeHtml(d.phone)}</a>` : ""}
    ${d.email ? `<a class="primary" href="mailto:${escapeHtml(d.email)}">Send Email</a>` : ""}
  </div>
  <div class="footer-copy">
    © ${new Date().getFullYear()} ${escapeHtml(d.name)}${d.location ? ` · ${escapeHtml(d.location)}` : ""} · Built with DevDrop Portfolio Builder
  </div>
</footer>

<script>${js}</script>
</body>
</html>`;

  return out;
}

export default function PortfolioBuilderTool() {
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const steps = [
    { title: "Profile", icon: User },
    { title: "Experience", icon: Briefcase },
    { title: "Projects", icon: FolderGit2 },
    { title: "Skills", icon: Wrench },
    { title: "Preview & Download", icon: Eye }
  ];

  const handleFillSample = () => {
    setData(DEFAULT_DATA);
  };

  const handleClearAll = () => {
    setData({
      name: "",
      role: "",
      tagline: "",
      email: "",
      phone: "",
      location: "",
      github: "",
      linkedin: "",
      instagram: "",
      twitter: "",
      aboutHeadline: "",
      aboutParagraph: "",
      theme: "dark",
      featuredProject: { title: "", link: "", description: "", tech: "", stats: "" },
      experiences: [],
      projects: [],
      skills: []
    });
  };

  // Add / remove experience
  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { id: "exp-" + Date.now(), role: "", when: "", desc: "", highlights: "" }
      ]
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id)
    }));
  };

  // Add / remove project
  const addProject = () => {
    setData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: "proj-" + Date.now(), title: "", link: "", desc: "", tags: "" }
      ]
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
  };

  // Add / remove skill group
  const addSkillGroup = () => {
    setData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: "sk-" + Date.now(), title: "Core Skills", items: "" }
      ]
    }));
  };

  const removeSkillGroup = (id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id)
    }));
  };

  const generatedHtml = React.useMemo(() => buildExportHtml(data), [data]);

  const handleDownload = () => {
    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(data.name || "portfolio").toLowerCase().replace(/[^a-z0-9]/g, "-")}-index.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleOpenStandalone = () => {
    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="w-full space-y-6 text-slate-100 font-sans">
      {/* ── Top Control & Action Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-cyber-card/90 border border-cyber-borderSubtle shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black font-mono text-white">
                Portfolio Website Builder
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                100% In-Browser
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Build your customized portfolio with interactive 3D expanding animations &amp; download a ready-to-deploy <code className="text-emerald-400">index.html</code>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleFillSample}
            className="px-3.5 py-2 rounded-xl bg-cyber-dark hover:bg-cyber-panel text-xs font-mono text-slate-300 hover:text-white border border-cyber-borderSubtle transition-all flex items-center gap-1.5"
            title="Load sample portfolio information"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyber-cyan" />
            <span>Load Sample Data</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
          >
            {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloadSuccess ? "Downloaded!" : "Download index.html"}</span>
          </button>
        </div>
      </div>

      {/* ── Modern Step Navigation Tabs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-cyber-dark/80 border border-cyber-borderSubtle backdrop-blur-md">
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = activeStep === idx;
          const isCompleted = activeStep > idx;

          return (
            <button
              key={step.title}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`flex items-center justify-center sm:justify-start gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all ${
                isActive
                  ? "bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20"
                  : isCompleted
                  ? "bg-cyber-card/60 text-emerald-400 hover:bg-cyber-card"
                  : "text-slate-400 hover:text-white hover:bg-cyber-card/40"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                  isActive ? "bg-black text-emerald-400" : isCompleted ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-slate-400"
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : <StepIcon className="w-3.5 h-3.5" />}
              </div>
              <span className="truncate">{step.title}</span>
            </button>
          );
        })}
      </div>

      {/* ── Main Workspace Body ── */}
      <div className="rounded-3xl bg-cyber-card/80 border border-cyber-borderSubtle p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        {/* ================= STEP 0: PERSONAL INFO ================= */}
        {activeStep === 0 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-cyber-borderSubtle pb-4">
              <h3 className="text-lg font-black font-mono text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                <span>Personal Profile &amp; Bio</span>
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-1">
                Your main identity, headline, social profiles, and background narrative.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="e.g. Alex Sharma"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Professional Role / Title *
                </label>
                <input
                  type="text"
                  value={data.role}
                  onChange={(e) => setData({ ...data, role: e.target.value })}
                  placeholder="e.g. Full-Stack Developer & UI Engineer"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                Short Tagline / Punchline
              </label>
              <input
                type="text"
                value={data.tagline}
                onChange={(e) => setData({ ...data, tagline: e.target.value })}
                placeholder="e.g. I build products that solve real problems with scalable code."
                className="w-full px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={data.phone}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  placeholder="Kolkata, India"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  GitHub Profile URL
                </label>
                <input
                  type="text"
                  value={data.github}
                  onChange={(e) => setData({ ...data, github: e.target.value })}
                  placeholder="github.com/username"
                  className="w-full px-3.5 py-2 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  LinkedIn Profile URL
                </label>
                <input
                  type="text"
                  value={data.linkedin}
                  onChange={(e) => setData({ ...data, linkedin: e.target.value })}
                  placeholder="linkedin.com/in/username"
                  className="w-full px-3.5 py-2 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  X / Twitter Profile
                </label>
                <input
                  type="text"
                  value={data.twitter}
                  onChange={(e) => setData({ ...data, twitter: e.target.value })}
                  placeholder="x.com/handle"
                  className="w-full px-3.5 py-2 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Instagram (Optional)
                </label>
                <input
                  type="text"
                  value={data.instagram}
                  onChange={(e) => setData({ ...data, instagram: e.target.value })}
                  placeholder="instagram.com/handle"
                  className="w-full px-3.5 py-2 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                  About Card Headline *
                </label>
                <input
                  type="text"
                  value={data.aboutHeadline}
                  onChange={(e) => setData({ ...data, aboutHeadline: e.target.value })}
                  placeholder="e.g. Turning complex code into elegant products"
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                  About Narrative / Story (Appears in expanding 3D card) *
                </label>
                <textarea
                  rows={4}
                  value={data.aboutParagraph}
                  onChange={(e) => setData({ ...data, aboutParagraph: e.target.value })}
                  placeholder="Tell clients or employers what drives you, your core strengths, and what problems you love solving..."
                  className="w-full px-4 py-2.5 rounded-xl bg-cyber-dark border border-cyber-borderSubtle text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors resize-y leading-relaxed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
                Default Color Theme
              </label>
              <div className="flex gap-4">
                {[
                  { id: "dark", label: "Dark Theme (Default)" },
                  { id: "light", label: "Light Theme" },
                  { id: "system", label: "Auto (Follow User Device)" }
                ].map((th) => (
                  <label key={th.id} className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="siteTheme"
                      value={th.id}
                      checked={data.theme === th.id}
                      onChange={() => setData({ ...data, theme: th.id as any })}
                      className="accent-emerald-400"
                    />
                    <span>{th.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 1: EXPERIENCE ================= */}
        {activeStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-cyber-borderSubtle pb-4">
              <div>
                <h3 className="text-lg font-black font-mono text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <span>Work Experience &amp; Journey</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Each role creates a horizontal panel in the animated career timeline.
                </p>
              </div>

              <button
                type="button"
                onClick={addExperience}
                className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Role</span>
              </button>
            </div>

            {data.experiences.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-cyber-borderSubtle text-center">
                <p className="text-sm font-mono text-slate-400 mb-3">No experience entries added yet.</p>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-mono font-bold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add First Experience
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {data.experiences.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-5 rounded-2xl bg-cyber-dark/90 border border-cyber-borderSubtle relative group space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        #{idx + 1} Role / Company
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete Role"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Role Title / Degree
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[idx].role = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          placeholder="e.g. Senior Frontend Engineer"
                          className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Company &amp; Dates
                        </label>
                        <input
                          type="text"
                          value={exp.when}
                          onChange={(e) => {
                            const updated = [...data.experiences];
                            updated[idx].when = e.target.value;
                            setData({ ...data, experiences: updated });
                          }}
                          placeholder="e.g. TechCorp · 2023 — Present"
                          className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Role Description &amp; Responsibilities
                      </label>
                      <textarea
                        rows={2}
                        value={exp.desc}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].desc = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        placeholder="What you built, teams you worked with, and problems you solved..."
                        className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Highlights &amp; Key Stats (One per line, max 3)
                      </label>
                      <textarea
                        rows={3}
                        value={exp.highlights}
                        onChange={(e) => {
                          const updated = [...data.experiences];
                          updated[idx].highlights = e.target.value;
                          setData({ ...data, experiences: updated });
                        }}
                        placeholder={"Reduced bundle size by 40%\nSpearheaded zero-downtime migration\nMentored junior devs"}
                        className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: PROJECTS ================= */}
        {activeStep === 2 && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Featured Project */}
            <div className="space-y-4">
              <div className="border-b border-cyber-borderSubtle pb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-bold">
                  FLAGSHIP WORK
                </span>
                <h3 className="text-base font-black font-mono text-white mt-1">
                  Featured Project (Shown Hero-Size)
                </h3>
                <p className="text-xs text-slate-400 font-sans">
                  The centerpiece of your portfolio, rendered with prominent stats and visit link.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-cyber-dark/90 border border-cyber-borderSubtle space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={data.featuredProject.title}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredProject: { ...data.featuredProject, title: e.target.value }
                        })
                      }
                      placeholder="e.g. CloudVault Storage Engine"
                      className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Project Link (Live demo or GitHub)
                    </label>
                    <input
                      type="text"
                      value={data.featuredProject.link}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredProject: { ...data.featuredProject, link: e.target.value }
                        })
                      }
                      placeholder="https://example.com/project"
                      className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Description &amp; Problem Solved
                  </label>
                  <textarea
                    rows={2}
                    value={data.featuredProject.description}
                    onChange={(e) =>
                      setData({
                        ...data,
                        featuredProject: { ...data.featuredProject, description: e.target.value }
                      })
                    }
                    placeholder="Describe what the project does, who uses it, and the engineering challenge..."
                    className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Technologies Used (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={data.featuredProject.tech}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredProject: { ...data.featuredProject, tech: e.target.value }
                        })
                      }
                      placeholder="React, TypeScript, Tailwind CSS, WebAssembly"
                      className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Project Stats (Format: Value | Label, one per line)
                    </label>
                    <textarea
                      rows={2}
                      value={data.featuredProject.stats}
                      onChange={(e) =>
                        setData({
                          ...data,
                          featuredProject: { ...data.featuredProject, stats: e.target.value }
                        })
                      }
                      placeholder={"15K+ | Active Users\n99.9% | Uptime"}
                      className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Projects */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyber-borderSubtle pb-3">
                <div>
                  <h3 className="text-base font-black font-mono text-white">
                    Additional Projects
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    Rendered in a modern responsive card grid.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addProject}
                  className="px-3 py-2 rounded-xl bg-cyber-cyan/10 hover:bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {data.projects.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-cyber-borderSubtle text-center">
                  <p className="text-xs font-mono text-slate-400 mb-2">No extra projects added yet.</p>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-3.5 py-1.5 rounded-lg bg-cyber-panel border border-cyber-borderSubtle text-xs font-mono text-slate-200"
                  >
                    + Add A Project
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.projects.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-cyber-dark/90 border border-cyber-borderSubtle space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-cyber-cyan">
                          Project #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeProject(proj.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].title = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="Project Name"
                        className="w-full px-3 py-1.5 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />

                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].link = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="Project Link (GitHub / Website)"
                        className="w-full px-3 py-1.5 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />

                      <textarea
                        rows={2}
                        value={proj.desc}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].desc = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="Short description..."
                        className="w-full px-3 py-1.5 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />

                      <input
                        type="text"
                        value={proj.tags}
                        onChange={(e) => {
                          const updated = [...data.projects];
                          updated[idx].tags = e.target.value;
                          setData({ ...data, projects: updated });
                        }}
                        placeholder="Tags (Comma separated, e.g. React, Next.js)"
                        className="w-full px-3 py-1.5 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= STEP 3: SKILLS ================= */}
        {activeStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-cyber-borderSubtle pb-4">
              <div>
                <h3 className="text-lg font-black font-mono text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-emerald-400" />
                  <span>Skills &amp; Technical Capabilities</span>
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-1">
                  Add categorized groups of technologies and tools (e.g. Frontend, Cloud, Architecture).
                </p>
              </div>

              <button
                type="button"
                onClick={addSkillGroup}
                className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill Group</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.skills.map((sk, idx) => (
                <div
                  key={sk.id}
                  className="p-5 rounded-2xl bg-cyber-dark/90 border border-cyber-borderSubtle space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      Group #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSkillGroup(sk.id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded-lg hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Group Title
                    </label>
                    <input
                      type="text"
                      value={sk.title}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[idx].title = e.target.value;
                        setData({ ...data, skills: updated });
                      }}
                      placeholder="e.g. Frontend Engineering, Databases, Cloud & DevOps"
                      className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Skills &amp; Tools (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={sk.items}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[idx].items = e.target.value;
                        setData({ ...data, skills: updated });
                      }}
                      placeholder="e.g. React, TypeScript, Next.js, GraphQL, Tailwind CSS"
                      className="w-full px-3.5 py-2 rounded-xl bg-cyber-card border border-cyber-borderSubtle text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= STEP 4: PREVIEW & EXPORT ================= */}
        {activeStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Preview Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-cyber-dark/90 border border-cyber-borderSubtle">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Viewport:</span>
                <div className="flex items-center gap-1 bg-cyber-card p-1 rounded-xl border border-cyber-borderSubtle">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                      previewDevice === "desktop" ? "bg-emerald-500 text-black font-bold" : "text-slate-400 hover:text-white"
                    }`}
                    title="Desktop Preview (100% width)"
                  >
                    <Laptop className="w-4 h-4" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewDevice("tablet")}
                    className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                      previewDevice === "tablet" ? "bg-emerald-500 text-black font-bold" : "text-slate-400 hover:text-white"
                    }`}
                    title="Tablet Preview (768px)"
                  >
                    <Tablet className="w-4 h-4" />
                    <span className="hidden sm:inline">Tablet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all ${
                      previewDevice === "mobile" ? "bg-emerald-500 text-black font-bold" : "text-slate-400 hover:text-white"
                    }`}
                    title="Mobile Preview (375px)"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 rounded-xl bg-cyber-card hover:bg-cyber-panel text-xs font-mono text-slate-200 border border-cyber-borderSubtle flex items-center gap-1.5 transition-all"
                  title="Copy complete source code"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied Source!" : "Copy HTML"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenStandalone}
                  className="px-3.5 py-2 rounded-xl bg-cyber-card hover:bg-cyber-panel text-xs font-mono text-slate-200 border border-cyber-borderSubtle flex items-center gap-1.5 transition-all"
                  title="Open live preview in separate tab"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyber-cyan" />
                  <span className="hidden sm:inline">New Tab</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  <span>Download index.html</span>
                </button>
              </div>
            </div>

            {/* Interactive Preview Container */}
            <div className="flex justify-center w-full py-2">
              <div
                className={`transition-all duration-300 rounded-2xl overflow-hidden border border-cyber-border shadow-2xl bg-[#090b10] ${
                  previewDevice === "mobile"
                    ? "w-[380px] h-[720px]"
                    : previewDevice === "tablet"
                    ? "w-[780px] h-[740px]"
                    : "w-full h-[760px]"
                }`}
              >
                <div className="h-8 bg-neutral-900 border-b border-neutral-800 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 truncate max-w-[240px]">
                    {data.name || "My Portfolio"} — Live Preview
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">60 FPS</span>
                </div>
                <iframe
                  srcDoc={generatedHtml}
                  title="Live Portfolio Preview"
                  className="w-full h-[calc(100%-32px)] border-0 block bg-black"
                  sandbox="allow-scripts allow-same-origin allow-modals"
                />
              </div>
            </div>

            {/* Deployment & Hosting Instructions Card */}
            <div className="p-5 rounded-2xl bg-cyber-dark/60 border border-cyber-borderSubtle text-xs text-slate-300 space-y-2">
              <h4 className="font-mono font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                How to Host Your Downloaded Portfolio for Free
              </h4>
              <p className="leading-relaxed">
                The downloaded file is a 100% self-contained, standalone <code className="text-emerald-400 font-mono">index.html</code> with all CSS styles, 3D card animations, dark/light theme logic, and fonts embedded.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] font-mono">
                <div className="p-3 rounded-xl bg-cyber-card border border-cyber-borderSubtle">
                  <span className="text-emerald-400 font-bold block mb-1">1. GitHub Pages</span>
                  Push to a repository named <code className="text-white">yourusername.github.io</code> and enable Pages in Settings.
                </div>
                <div className="p-3 rounded-xl bg-cyber-card border border-cyber-borderSubtle">
                  <span className="text-cyber-cyan font-bold block mb-1">2. Netlify Drop</span>
                  Drag and drop the folder containing your <code className="text-white">index.html</code> onto <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="underline text-cyber-cyan">app.netlify.com/drop</a>.
                </div>
                <div className="p-3 rounded-xl bg-cyber-card border border-cyber-borderSubtle">
                  <span className="text-purple-400 font-bold block mb-1">3. Vercel</span>
                  Run <code className="text-white">vercel deploy</code> or push to GitHub to host on Vercel with your custom domain.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Bottom Step Navigation Buttons ── */}
        <div className="flex items-center justify-between border-t border-cyber-borderSubtle pt-6 mt-8">
          <button
            type="button"
            onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
            disabled={activeStep === 0}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
              activeStep === 0
                ? "opacity-30 cursor-not-allowed text-slate-500"
                : "bg-cyber-dark hover:bg-cyber-panel text-slate-200 border border-cyber-borderSubtle"
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Step {activeStep + 1} of {steps.length}: <strong className="text-white">{steps[activeStep].title}</strong>
          </span>

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Website</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
