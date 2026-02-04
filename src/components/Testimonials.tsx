import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { HoloCard } from './ui/HoloCard';
const testimonials = [{
  id: 1,
  name: 'Sarah Connor',
  role: 'Tech Reviewer',
  content: "The APEX X-1 isn't just a phone, it's a portal to the digital realm. The holographic display is unlike anything I've ever seen.",
  rating: 5
}, {
  id: 2,
  name: 'Rick Deckard',
  role: 'Blade Runner',
  content: 'Durable, fast, and reliable. The battery life on the Neural Pods lasts through even the longest investigations.',
  rating: 5
}, {
  id: 3,
  name: 'Motoko Kusanagi',
  role: 'Security Chief',
  content: 'The encryption protocols on APEX devices are top-tier. Finally, a device that takes security as seriously as I do.',
  rating: 4
}];
export function Testimonials() {
  return <section className="py-24 bg-[#050508] relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#00f0ff]/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            USER <span className="text-[#00f0ff]">FEEDBACK</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied users who have upgraded to the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => <HoloCard key={item.id} delay={index * 0.2} className="h-full">
              <div className="p-6 flex flex-col h-full">
                <div className="mb-6 text-[#00f0ff]">
                  <Quote size={40} className="opacity-50" />
                </div>

                <p className="text-gray-300 mb-6 flex-1 leading-relaxed italic">
                  "{item.content}"
                </p>

                <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-[#00f0ff]/30 flex items-center justify-center text-white font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{item.name}</h4>
                    <p className="text-xs text-[#00f0ff] font-mono">
                      {item.role}
                    </p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < item.rating ? 'fill-[#00f0ff] text-[#00f0ff]' : 'text-gray-700'} />)}
                  </div>
                </div>
              </div>
            </HoloCard>)}
        </div>
      </div>
    </section>;
}