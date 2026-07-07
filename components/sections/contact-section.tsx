"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, CheckCircle, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const socialLinks = [
  { name: "Email", href: "mailto:sudhan.bhattarainp@gmail.com", icon: Mail, destination: "email draft" },
  { name: "GitHub", href: "https://github.com/Sujan-Nepal", icon: Github, destination: "GitHub profile" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/sudhan-bhattarai-662769392/", icon: Linkedin, destination: "LinkedIn profile" },
  { name: "Instagram", href: "https://www.instagram.com/suzzy.3x3", icon: Instagram, destination: "Instagram profile" },
];

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitInfo, setSubmitInfo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [botField, setBotField] = useState("");
  const [pendingLink, setPendingLink] = useState<(typeof socialLinks)[number] | null>(null);

  const triggerPageShake = () => {
    if (typeof document === "undefined") return;

    const page = document.getElementById("page-shell");
    if (!page) return;

    page.classList.remove("page-shake");

    // Force a reflow so rapid repeated clicks restart the animation cleanly.
    void page.offsetWidth;

    page.classList.add("page-shake");
    window.setTimeout(() => {
      page.classList.remove("page-shake");
    }, 900);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitInfo(null);
    setSubmitting(true);

    const payload = new URLSearchParams({
      "form-name": "contact",
      "bot-field": botField,
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });

    try {
      const isLocalhost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1");

      if (isLocalhost) {
        const subject = encodeURIComponent(`New project inquiry from ${formData.name}`);
        const body = encodeURIComponent(
          `Name: ${formData.name}\nEmail: ${formData.email}\n\nProject:\n${formData.message}`
        );
        window.location.href = `mailto:sudhan.bhattarainp@gmail.com?subject=${subject}&body=${body}`;
        setSubmitInfo("Local preview fallback: your email app was opened with the message.");
        return;
      }

      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: payload.toString(),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setBotField("");
      window.setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setSubmitError("Could not send right now. Please try again or email me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof socialLinks)[number]
  ) => {
    event.preventDefault();
    setPendingLink(link);
  };

  const handleProceedToLink = () => {
    if (!pendingLink || typeof window === "undefined") return;

    if (pendingLink.href.startsWith("mailto:")) {
      window.location.href = pendingLink.href;
    } else {
      window.open(pendingLink.href, "_blank", "noopener,noreferrer");
    }

    setPendingLink(null);
  };

  return (
    <section id="contact" className="py-32 border-t border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
            Contact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight drop-shadow-[0_0_25px_rgba(147,197,253,0.5)]">
            Let&apos;s talk 💬
          </h2>
          <p className="mt-6 text-lg text-zinc-400 max-w-xl">
            Have a project or need help? Fill out the form, and I&apos;ll get back to you soon ✉️
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <input type="hidden" name="form-name" value="contact" />
              <p className="hidden" aria-hidden="true">
                <label>
                  Don&apos;t fill this out:
                  <input
                    name="bot-field"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                  />
                </label>
              </p>
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Name</label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-border text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors duration-300"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b border-border text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-400 mb-2">Your Project</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-0 py-3 bg-transparent border-b border-border text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project..."
                  required
                />
              </div>

              <InteractiveButton
                type="submit"
                variant="primary"
                disabled={submitted || submitting}
                className="px-8 py-4"
                onClick={triggerPageShake}
              >
                {submitting ? (
                  "Sending..."
                ) : submitted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Message Sent
                  </>
                ) : (
                  "Submit"
                )}
              </InteractiveButton>

              {submitError && (
                <p className="text-sm text-rose-300">{submitError}</p>
              )}

              {submitInfo && (
                <p className="text-sm text-cyan-300">{submitInfo}</p>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-12"
          >
            {/* Email */}
            <div>
              <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-3 block">
                Email
              </span>
              <a
                href="mailto:sudhan.bhattarainp@gmail.com"
                className="group inline-flex items-center gap-2 text-xl text-white hover:text-zinc-300 transition-colors duration-300"
              >
                sudhan.bhattarainp@gmail.com
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors duration-300" />
              </a>
            </div>

            {/* Location */}
            <div>
              <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-3 block">
                Location
              </span>
              <p className="text-xl text-white">Nepal</p>
            </div>

            {/* Social */}
            <div>
              <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-3 block">
                Social
              </span>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => handleSocialClick(event, link)}
                    className="group flex items-center gap-2 px-4 py-3 rounded-xl glass-card hover:border-purple-500/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                  >
                    <link.icon className="w-5 h-5 text-zinc-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors duration-300">
                      {link.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="pt-8 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
                </div>
                <p className="text-sm text-zinc-400">
                  Available for freelance projects
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AlertDialog open={pendingLink !== null} onOpenChange={(open) => !open && setPendingLink(null)}>
        <AlertDialogContent className="leave-page-dialog max-w-md border-white/10 bg-[#120a1f]/96 text-white shadow-[0_20px_80px_rgba(3,0,20,0.5)] backdrop-blur-2xl">
          <AlertDialogHeader className="space-y-3 text-left">
            <span className="leave-page-dialog-kicker text-xs font-mono uppercase tracking-[0.28em] text-zinc-500">
              Leave Page
            </span>
            <AlertDialogTitle className="leave-page-dialog-title text-2xl font-semibold text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="leave-page-dialog-description text-sm leading-relaxed text-zinc-300">
              You&apos;re about to leave this page and open the{" "}
              <span className="leave-page-dialog-emphasis font-semibold text-white">{pendingLink?.destination}</span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-2 flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:space-x-0">
            <AlertDialogCancel className="leave-page-dialog-cancel mt-0 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white">
              Dismiss
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProceedToLink}
              className="bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500 text-white shadow-[0_0_28px_rgba(99,102,241,0.32)] hover:opacity-95"
            >
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
