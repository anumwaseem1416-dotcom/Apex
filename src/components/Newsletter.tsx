import React from 'react';
import { NeonButton } from './ui/NeonButton';
import { Mail } from 'lucide-react';
export function Newsletter() {
  return <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#00f0ff]/5 to-[#0a0a0f]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-2xl bg-black/40 border border-[#00f0ff]/30 backdrop-blur-sm shadow-[0_0_50px_rgba(0,240,255,0.1)]">
          <div className="w-16 h-16 mx-auto mb-6 bg-[#00f0ff]/10 rounded-full flex items-center justify-center text-[#00f0ff] box-glow">
            <Mail size={32} />
          </div>

          <h2 className="text-3xl font-bold text-white mb-4">
            JOIN THE <span className="text-[#00f0ff]">FUTURE</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Subscribe to our neural feed for the latest product drops, software
            updates, and exclusive tech insights.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" className="flex-1 bg-black/50 border border-white/20 rounded px-6 py-3 text-white focus:border-[#00f0ff] focus:shadow-[0_0_15px_rgba(0,240,255,0.3)] outline-none transition-all" />
            <NeonButton variant="primary">Subscribe</NeonButton>
          </form>

          <p className="mt-4 text-xs text-gray-500 font-mono">
            No spam. Only revolution. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>;
}