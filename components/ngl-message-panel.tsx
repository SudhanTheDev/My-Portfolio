"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ExternalLink, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { NglIcon } from "@/components/ngl-icon";

const NGL_URL = "https://ngl.link/dudhchiyaandkhajurikopuff2";

export function NglMessagePanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.58 }}
      className="mt-28 overflow-hidden rounded-2xl border border-pink-400/20 bg-[#0c0819]/85 shadow-[0_18px_60px_rgba(236,72,153,0.12)] backdrop-blur-xl"
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="ngl-message-frame"
        onClick={() => setIsOpen((open) => !open)}
        className="group flex w-full items-center gap-3 p-3.5 text-left transition-colors hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pink-300/60"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500/25 to-orange-400/20 ring-1 ring-pink-300/20">
          <NglIcon className="h-7 w-7" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-white">Send an anonymous message</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-[0.68rem] text-zinc-400">
            <LockKeyhole className="h-3 w-3 text-pink-300" />
            Opens the real NGL sender here
          </span>
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-zinc-400 group-hover:text-white"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id="ngl-message-frame"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 p-2.5 pt-3">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-pink-500 to-orange-400">
                <iframe
                  src={NGL_URL}
                  title="Send Sudhan an anonymous NGL message"
                  loading="lazy"
                  className="h-[31rem] w-full bg-gradient-to-br from-pink-500 to-orange-400"
                />
              </div>
              <a
                href={NGL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 flex items-center justify-center gap-2 rounded-lg py-2 text-[0.7rem] font-medium text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                Open NGL separately if the frame does not load
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
