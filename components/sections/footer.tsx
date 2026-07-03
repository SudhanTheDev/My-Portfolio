"use client";

import { motion } from "framer-motion";
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
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-20 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Tagline */}
          <div className="lg:col-span-2">
            <button onClick={scrollToTop} className="group mb-6">
              <span className="text-3xl font-medium text-white group-hover:text-zinc-300 transition-colors duration-300">
                SB.
              </span>
            </button>
            <p className="text-sm text-zinc-500 max-w-sm">
              Creating beautiful digital experiences from Nepal. Available for freelance projects and collaborations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
              /Quick Links
            </span>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
              /Contact
            </span>
            <a
              href="mailto:sudhan.bhattarainp@gmail.com"
              className="group inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors duration-300 mb-6"
            >
              sudhan.bhattarainp@gmail.com
              <ArrowUpRight className="w-3 h-3" />
            </a>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-500 hover:text-white transition-colors duration-300"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Sudhan B. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="text-xs text-zinc-500 hover:text-white transition-colors duration-300"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
