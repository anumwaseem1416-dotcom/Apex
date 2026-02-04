import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Wifi, Globe } from 'lucide-react';
const features = [{
  icon: <Zap className="w-8 h-8" />,
  title: 'Quantum Processing',
  desc: 'Next-gen chips capable of 50 trillion operations per second.'
}, {
  icon: <Shield className="w-8 h-8" />,
  title: 'Bio-Metric Security',
  desc: 'Retinal scan and DNA-sequence locking mechanisms.'
}, {
  icon: <Wifi className="w-8 h-8" />,
  title: 'Hyper-Link 6G',
  desc: 'Zero latency connection anywhere in the solar system.'
}, {
  icon: <Globe className="w-8 h-8" />,
  title: 'Holographic UI',
  desc: 'Project your interface into 3D space with gesture control.'
}];
export function Features() {
  return <section className="py-24 bg-[#050508] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent"></div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: index * 0.1
        }} className="group p-6 rounded-xl bg-white/5 border border-white/5 hover:border-[#00f0ff]/50 transition-all duration-300 hover:bg-white/10">
              <div className="mb-4 p-3 rounded-lg bg-[#00f0ff]/10 w-fit text-[#00f0ff] group-hover:text-white group-hover:bg-[#00f0ff] transition-colors duration-300 box-glow">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#00f0ff] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>)}
        </div>
      </div>
    </section>;
}