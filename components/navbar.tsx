"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { BrandLogo } from "./brand-logo";
import { InteractiveButton } from "./interactive-button";
import { MusicButton } from "./music-button";
import { transition } from "@/lib/motion";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 50);
        const sections = navLinks.map((link) => link.href.replace("#", ""));
        for (const section of sections.reverse()) {
          const element = document.getElementById(section);
          if (element && element.getBoundingClientRect().top <= 200) {
            setActiveSection(section);
            break;
          }
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={transition.default}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "py-3"
            : "py-0"
        )}
      >
        <div className={cn(
          "px-4 sm:px-6 lg:px-8 transition-all duration-500",
          scrolled && "mx-3 sm:mx-4 glass-card rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        )}>
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3">
            <a href="#home" className="justify-self-start hover:opacity-90 transition-opacity">
              <BrandLogo size="md" />
            </a>

            <div className="hidden md:flex items-center justify-self-center gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace("#", "");
                return (
                  <InteractiveButton
                    key={link.name}
                    href={link.href}
                    variant="nav"
                    active={isActive}
                    className={cn(
                      "px-4 py-2",
                      isActive ? "text-white nav-link-active" : "text-muted"
                    )}
                  >
                    {link.name}
                  </InteractiveButton>
                );
              })}
            </div>

            <div className="flex items-center justify-self-end gap-3">
              <MusicButton />
              <ThemeToggle />
              <InteractiveButton
                variant="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </InteractiveButton>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-20 z-40 md:hidden glass-card rounded-2xl p-6"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "py-3 px-4 text-lg font-medium rounded-xl transition-colors",
                    activeSection === link.href.replace("#", "")
                      ? "text-white bg-white/10"
                      : "text-muted"
                  )}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
