import React from 'react';
import { motion } from 'framer-motion';
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}
export function NeonButton({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: NeonButtonProps) {
  const baseStyles = 'relative px-8 py-3 font-bold uppercase tracking-wider text-sm transition-all duration-300 overflow-hidden group';
  const variants = {
    primary: 'bg-transparent border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]',
    secondary: 'bg-transparent border border-[#0066ff] text-[#0066ff] hover:bg-[#0066ff] hover:text-white hover:shadow-[0_0_30px_rgba(0,102,255,0.6)]'
  };
  return <motion.button whileHover={{
    scale: 1.05
  }} whileTap={{
    scale: 0.95
  }} className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      <span className="relative z-10">{children}</span>
      {/* Glitch effect overlay could go here */}
    </motion.button>;
}