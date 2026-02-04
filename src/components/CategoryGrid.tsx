import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Headphones } from 'lucide-react';
const categories = [{
  id: 1,
  title: 'Smartphones',
  subtitle: 'Next-Gen Communication',
  icon: <Smartphone className="w-12 h-12" />,
  image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop',
  color: 'from-blue-500 to-cyan-500'
}, {
  id: 2,
  title: 'Laptops',
  subtitle: 'Quantum Computing',
  icon: <Laptop className="w-12 h-12" />,
  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=800&auto=format&fit=crop',
  color: 'from-purple-500 to-pink-500'
}, {
  id: 3,
  title: 'Accessories',
  subtitle: 'Neural Enhancements',
  icon: <Headphones className="w-12 h-12" />,
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  color: 'from-amber-500 to-orange-500'
}];
export function CategoryGrid() {
  return <section className="py-24 bg-[#0a0a0f] relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => <motion.div key={category.id} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.2
        }} whileHover={{
          y: -10
        }} className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer border border-white/10">
              {/* Background Image */}
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{
            backgroundImage: `url(${category.image})`
          }} />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end items-start">
                <div className={`mb-4 p-4 rounded-full bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)]`}>
                  <div className="text-white">{category.icon}</div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-300 font-mono text-sm tracking-wider uppercase">
                  {category.subtitle}
                </p>

                {/* Decorative Line */}
                <div className="w-12 h-1 bg-[#00f0ff] mt-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>

              {/* Border Glow on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#00f0ff]/50 rounded-2xl transition-colors duration-300 pointer-events-none" />
            </motion.div>)}
        </div>
      </div>
    </section>;
}