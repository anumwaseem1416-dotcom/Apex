import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { NeonButton } from './ui/NeonButton';
import { ChevronRight, LogIn } from 'lucide-react';
export function Hero() {
  return <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 cyber-grid-bg"></div>
      </div>

      {/* Radial Gradient Overlay for depth */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f]"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        ease: 'easeOut'
      }}>
          <h2 className="text-[#00f0ff] font-mono text-sm md:text-base tracking-[0.3em] mb-4 uppercase">
            Next Gen Interface
          </h2>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white mb-6 text-glow">
            APEX{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              MOBILES
            </span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the future of communication. Holographic displays,
            quantum processing, and neural-link capabilities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <NeonButton variant="primary">Explore Models</NeonButton>
            <NeonButton variant="secondary">
              <span className="flex items-center gap-2">
                Watch Demo <ChevronRight size={16} />
              </span>
            </NeonButton>
            <Link to="/login">
              <NeonButton variant="secondary">
                <span className="flex items-center gap-2">
                  <LogIn size={16} /> Admin Login
                </span>
              </NeonButton>
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1,
        duration: 1
      }} className="absolute top-1/2 left-10 hidden lg:block">
          <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-[#00f0ff] to-transparent"></div>
          <div className="text-[10px] font-mono text-[#00f0ff] mt-2 rotate-90 origin-left">
            SYS.READY
          </div>
        </motion.div>

        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.2,
        duration: 1
      }} className="absolute bottom-20 right-10 hidden lg:block">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-[#00f0ff] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#0066ff] rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-150"></div>
          </div>
        </motion.div>
      </div>
    </section>;
}