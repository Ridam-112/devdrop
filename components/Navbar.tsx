"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Menu, X, ChevronDown, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/data/tools";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Games", href: "/games" },
    { label: "Guides", href: "/guides" },
    { label: "About", href: "/about" },
  ];

  const indexableCategories = CATEGORIES.filter((c) => c.indexable !== false);

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 flex items-center justify-center shadow-md group-hover:border-emerald-500 transition-all duration-300">
            <img 
              src="/logo.png" 
              alt="DevDrop Logo" 
              width={40}
              height={40}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-wider text-white group-hover:text-emerald-400 transition-colors font-mono">
                DEVDROP
              </span>
            </div>
            <p className="text-[10px] font-mono text-neutral-400 -mt-0.5 hidden sm:block">
              Free Online Web Tools &amp; Games
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-neutral-800 text-emerald-400 border border-neutral-700"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              onBlur={() => setTimeout(() => setCategoriesOpen(false), 200)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  categoriesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {categoriesOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {indexableCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="block px-3 py-2 rounded-lg text-xs font-medium text-neutral-300 hover:text-emerald-400 hover:bg-neutral-800 transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/tools"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-black text-xs font-bold font-mono tracking-wider hover:bg-emerald-400 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXPLORE TOOLS</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-cyber-card border border-cyber-borderSubtle text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyber-green"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-cyber-borderSubtle bg-cyber-dark px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-cyber-green hover:bg-cyber-panel"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 border-t border-cyber-borderSubtle/60">
            <span className="block text-xs font-mono text-cyber-muted px-3 pb-2 uppercase tracking-wider">
              Tool Categories
            </span>
            <div className="grid grid-cols-2 gap-1 px-1">
              {indexableCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2 py-1.5 rounded text-xs text-slate-300 hover:text-emerald-400 hover:bg-neutral-800"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/tools"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-500 text-black font-bold font-mono text-xs text-center"
          >
            Explore All Tools
          </Link>
        </div>
      )}
    </header>
  );
};
