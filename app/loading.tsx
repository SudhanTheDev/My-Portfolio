"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050505]">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple p-0.5">
            <div className="w-full h-full rounded-[15px] bg-[#050505] flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-br from-accent-blue to-accent-purple bg-clip-text text-transparent">
                SB
              </span>
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple opacity-30 blur-xl" />
        </motion.div>

        {/* Loading dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
