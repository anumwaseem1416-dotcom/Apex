import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
export function Contact() {
  return <section className="py-24 relative bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/5 to-transparent p-1 rounded-2xl">
          <div className="bg-[#0a0a0f] rounded-xl p-8 md:p-12 border border-white/10 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0066ff]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">
                  Initialize <span className="text-[#00f0ff]">Contact</span>
                </h2>
                <p className="text-gray-400 mb-8">
                  Ready to upgrade your reality? Our neural specialists are
                  standing by to assist with your transition.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-gray-300 hover:text-[#00f0ff] transition-colors cursor-pointer group">
                    <div className="p-2 rounded bg-white/5 group-hover:bg-[#00f0ff]/20 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-mono">uplink@apex-mobiles.tech</span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-300 hover:text-[#00f0ff] transition-colors cursor-pointer group">
                    <div className="p-2 rounded bg-white/5 group-hover:bg-[#00f0ff]/20 transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="font-mono">+1 (800) CYBER-NET</span>
                  </div>

                  <div className="flex items-center gap-4 text-gray-300 hover:text-[#00f0ff] transition-colors cursor-pointer group">
                    <div className="p-2 rounded bg-white/5 group-hover:bg-[#00f0ff]/20 transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-mono">Neo-Tokyo, Sector 7G</span>
                  </div>
                </div>
              </div>

              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-xs font-mono text-[#00f0ff] mb-2 uppercase tracking-wider">
                    Identity
                  </label>
                  <input type="text" className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#00f0ff] mb-2 uppercase tracking-wider">
                    Frequency
                  </label>
                  <input type="email" className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#00f0ff] mb-2 uppercase tracking-wider">
                    Transmission
                  </label>
                  <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff] transition-all" placeholder="Enter your message"></textarea>
                </div>
                <button className="w-full bg-[#00f0ff] text-black font-bold py-3 px-6 rounded hover:bg-[#00c2cf] transition-colors uppercase tracking-widest text-sm">
                  Send Transmission
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>;
}