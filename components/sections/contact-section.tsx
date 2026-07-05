"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, CheckCircle, Github, Linkedin, Instagram, Mail } from "lucide-react";
import { InteractiveButton } from "@/components/interactive-button";

const socialLinks = [
  { name: "Email", href: "mailto:sudhanbhattarainp@gmail.com", icon: Mail },
  { name: "GitHub", href: "https://github.com/Sujan-Nepal", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/sudhan-bhattarai-662769392/", icon: Linkedin },
  { name: "Instagram", href: "https://www.instagram.com/suzzy.3x3", icon: Instagram },
];

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  return (
    <section id="contact" className="py-32 border-t border-border">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-4 block">
            /Contact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">
            Let&apos;s talk.
          </h2>
          <p className="mt-6 text-lg text-zinc-400 max-w-xl">
            Have a project or need help? Fill out the form, and I&apos;ll get back to you soon.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Name</label>
                <input
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
                disabled={submitted}
                className="px-8 py-4"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Message Sent
                  </>
                ) : (
                  "Submit"
                )}
              </InteractiveButton>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-12"
          >
            {/* Email */}
            <div>
              <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-3 block">
                /Email
              </span>
              <a
                href="mailto:sudhanbhattarainp@gmail.com"
                className="group inline-flex items-center gap-2 text-xl text-white hover:text-zinc-300 transition-colors duration-300"
              >
                sudhanbhattarainp@gmail.com
                <ArrowUpRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors duration-300" />
              </a>
            </div>

            {/* Location */}
            <div>
              <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-3 block">
                /Location
              </span>
              <p className="text-xl text-white">Nepal</p>
            </div>

            {/* Social */}
            <div>
              <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-3 block">
                /Social
              </span>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
    </section>
  );
}
