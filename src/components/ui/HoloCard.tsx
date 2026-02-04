import React from 'react';
import { motion } from 'framer-motion';
interface HoloCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}
export function HoloCard({
  children,
  className = '',
  delay = 0
}: HoloCardProps) {
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true
  }} transition={{
    duration: 0.5,
    delay
  }} className={`holo-border-container rounded-xl p-1 ${className}`}>
      <div className="relative z-10 h-full w-full rounded-xl bg-[#0a0a0f]/90 backdrop-blur-sm p-6 border border-white/5 hover:border-[#00f0ff]/30 transition-colors duration-300">
        {children}
      </div>
    </motion.div>;
}