"use client";

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 100, 0], x: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{ y: [0, -100, 0], x: [0, -50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl"
        animate={{ y: [50, -50, 50] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual Element - Left Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="relative w-full max-w-sm">
              {/* Animated gradient box */}
              <motion.div
                className="relative w-80 h-96 rounded-3xl overflow-hidden"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-pink-600/30" />
                
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                  }} />
                </div>

                {/* Center Circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 opacity-20"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />
                </div>

                {/* Floating Elements */}
                <motion.div
                  className="absolute top-8 right-8 w-12 h-12 border-2 border-blue-400 rounded-lg opacity-30"
                  animate={{ rotate: [0, 90, 180, 270, 360] }}
                  transition={{
  duration: 8,
  repeat: Infinity,
  ease: "linear",
}}
                />
                <motion.div
                  className="absolute bottom-12 left-8 w-8 h-8 border border-purple-400 rounded-full opacity-30"
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-4 -left-4 px-6 py-3 bg-white text-black text-xs font-bold tracking-widest rounded-xl shadow-2xl"
              >
                CREATIVE DEVELOPER
              </motion.div>
            </div>
          </motion.div>

          {/* Content - Right Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <span className="text-xs font-mono text-blue-400 tracking-widest uppercase font-bold">
                ✨ Building Digital Experiences
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-tight font-display">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
              >
                Hey, I&apos;m
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-white mt-3"
              >
                Sudhan. 👨‍💻
              </motion.span>
            </h1>

            {/* Bio - Enhanced Typography */}
            <div className="space-y-5 text-lg text-zinc-300 leading-relaxed max-w-2xl mb-8">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                A <span className="text-blue-400 font-semibold">20-year-old developer</span> from <span className="text-white font-semibold">🇳🇵 Nepal</span> building beautiful digital products. Pursuing my BIT degree while creating mobile apps, websites, and AI-powered solutions.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                I specialize in <span className="text-purple-400 font-semibold">📱 Flutter development</span>, <span className="text-pink-400 font-semibold">🎨 modern web design</span>, and <span className="text-blue-400 font-semibold">🤖 AI integration</span>. Obsessed with creating experiences that look stunning and work flawlessly.
              </motion.p>
            </div>

            {/* CTA Buttons - Enhanced Style */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 btn-interactive relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🚀 Explore My Work
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ x: [0, 100, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 border-2 border-white text-white text-sm font-bold rounded-xl hover:bg-white hover:text-black transition-all duration-300 btn-interactive relative overflow-hidden flex items-center gap-2"
              >
                <span className="relative z-10 flex items-center gap-2">
                  💬 Get In Touch
                </span>
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                />
              </motion.a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex gap-12 mt-12 pt-8 border-t border-zinc-800"
            >
              <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                <div className="text-3xl font-bold text-blue-400">25+</div>
                <div className="text-xs text-zinc-500 mt-1">🎨 Projects Built</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                <div className="text-3xl font-bold text-purple-400">20+</div>
                <div className="text-xs text-zinc-500 mt-1">⚡ Technologies</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
                <div className="text-3xl font-bold text-pink-400">100%</div>
                <div className="text-xs text-zinc-500 mt-1">❤️ Passionate</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
