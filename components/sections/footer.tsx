"use client";

import { BrandLogo } from "@/components/brand-logo";
import { InteractiveButton } from "@/components/interactive-button";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-white/10 py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-violet-950/20 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="glass-card mb-12 rounded-3xl p-10 text-center md:p-14">
          <h2 className="mb-4 text-3xl font-bold font-display md:text-5xl">
            <span className="text-shimmer">Let&apos;s build something epic</span>
            <span className="project-emoji ml-3 inline-block align-middle text-foreground">🚀</span>
          </h2>
          <p className="mx-auto mb-8 max-w-md text-muted">
            Have a project in mind? Let&apos;s turn your ideas into reality{" "}
            <span className="project-emoji align-middle text-foreground">✨</span>
          </p>
          <InteractiveButton href="#contact" variant="primary" showArrow className="px-8 py-4">
            Start a Project
          </InteractiveButton>
        </div>

        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div>
            <InteractiveButton
              variant="ghost"
              onClick={scrollToTop}
              className="mb-4 border-0 px-0 py-0 hover:bg-transparent"
            >
              <BrandLogo size="sm" />
            </InteractiveButton>
            <p className="max-w-xs text-sm text-muted">
              Creating beautiful digital experiences from Nepal.
            </p>
          </div>

          <div className="md:text-right">
            <span className="mb-4 block text-xs font-mono uppercase tracking-widest text-violet-400">
              Links
            </span>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-muted transition-colors hover:text-foreground">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Sudhan Bhattarai. All rights reserved.</p>
          <InteractiveButton variant="ghost" onClick={scrollToTop} className="text-xs px-3 py-1.5">
            Back to top ↑
          </InteractiveButton>
        </div>
      </div>
    </footer>
  );
}
