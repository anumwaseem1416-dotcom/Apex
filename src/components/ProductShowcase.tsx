import React from 'react';
import { motion } from 'framer-motion';
import { HoloCard } from './ui/HoloCard';
import { NeonButton } from './ui/NeonButton';
import { Cpu, HardDrive, Battery, Smartphone } from 'lucide-react';
const products = [{
  id: 1,
  name: 'APEX X-1',
  price: '$1,299',
  specs: {
    cpu: 'Quantum Snap 8',
    ram: '16GB',
    storage: '1TB'
  },
  tag: 'Flagship'
}, {
  id: 2,
  name: 'APEX NEON',
  price: '$999',
  specs: {
    cpu: 'Neural Core G4',
    ram: '12GB',
    storage: '512GB'
  },
  tag: 'Best Value'
}, {
  id: 3,
  name: 'APEX PRO',
  price: '$1,599',
  specs: {
    cpu: 'Quantum Snap 9',
    ram: '32GB',
    storage: '2TB'
  },
  tag: 'Professional'
}];
export function ProductShowcase() {
  return <section className="py-24 relative z-10 bg-[#0a0a0f]">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              LATEST MODELS
            </span>
          </h2>
          <div className="h-1 w-24 bg-[#00f0ff] mx-auto rounded-full box-glow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => <HoloCard key={product.id} delay={index * 0.2}>
              <div className="flex flex-col h-full">
                {/* Image Placeholder */}
                <div className="relative h-64 mb-6 rounded-lg bg-gradient-to-br from-gray-900 to-black border border-white/10 flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-500 scale-110"></div>
                  <Smartphone className="w-24 h-24 text-[#00f0ff] opacity-80 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] z-10" />

                  {/* Floating Tag */}
                  <div className="absolute top-4 right-4 bg-[#00f0ff]/10 border border-[#00f0ff]/50 px-3 py-1 rounded text-xs font-mono text-[#00f0ff]">
                    {product.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      {product.name}
                    </h3>
                    <span className="text-xl font-mono text-[#00f0ff] text-glow">
                      {product.price}
                    </span>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-3 gap-2 mb-8">
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
                      <Cpu className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                      <span className="block text-xs font-mono text-gray-300">
                        {product.specs.cpu}
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
                      <HardDrive className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                      <span className="block text-xs font-mono text-gray-300">
                        {product.specs.ram}
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 rounded border border-white/5 text-center">
                      <Battery className="w-4 h-4 mx-auto mb-1 text-gray-400" />
                      <span className="block text-xs font-mono text-gray-300">
                        {product.specs.storage}
                      </span>
                    </div>
                  </div>
                </div>

                <NeonButton fullWidth>Pre-Order Now</NeonButton>
              </div>
            </HoloCard>)}
        </div>
      </div>
    </section>;
}