"use client";

import { BrandLogo } from "@/components/brand-logo";
import { InteractiveButton } from "@/components/interactive-button";
import { ArrowUpRight } from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const socialLinks = [
  { name: "GitHub", href: "https://github.com" },
  { name: "LinkedIn", href: "https://linkedin.com" },
  { name: "Instagram", href: "https://instagram.com" },
  { name: "Email", href: "mailto:sudhan.bhattarainp@gmail.com" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative py-24 border-t border-white/10">
      <div className="absolute inset-0 bg-gradient-to-t from-violet-950/20 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="glass-card rounded-3xl p-10 md:p-14 mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            <span className="text-shimmer">Let&apos;s build something epic.</span>
          </h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Have a project in mind? Let&apos;s turn your ideas into reality.
          </p>
          <InteractiveButton href="#contact" variant="primary" showArrow className="px-8 py-4">
            Start a Project
          </InteractiveButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <InteractiveButton variant="ghost" onClick={scrollToTop} className="mb-4 px-0 py-0 border-0 hover:bg-transparent">
              <BrandLogo size="sm" />
            </InteractiveButton>
            <p className="text-sm text-muted max-w-xs">
              Creating beautiful digital experiences from Nepal.
            </p>
          </div>

          <div>
            <span className="text-xs font-mono text-violet-400 tracking-widest uppercase mb-4 block">Links</span>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-muted hover:text-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-xs font-mono text-violet-400 tracking-widest uppercase mb-4 block">Connect</span>
            <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <InteractiveButton
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="pill"
                    className="text-sm"
                  >
                    {link.name}
                  </InteractiveButton>
                ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Sudhan Bhattarai. All rights reserved.</p>
          <InteractiveButton variant="ghost" onClick={scrollToTop} className="text-xs px-3 py-1.5">
            Back to top ↑
          </InteractiveButton>
        </div>
      </div>
    </footer>
  );
}
