import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
export function TechSpecs() {
  const specs = [{
    feature: 'Holographic Display',
    standard: false,
    pro: true,
    ultra: true
  }, {
    feature: 'Quantum Processor',
    standard: 'Gen 2',
    pro: 'Gen 3',
    ultra: 'Gen 4 (Max)'
  }, {
    feature: 'Neural Link Support',
    standard: false,
    pro: true,
    ultra: true
  }, {
    feature: 'Battery Life',
    standard: '24h',
    pro: '48h',
    ultra: '72h + Solar'
  }, {
    feature: 'Storage',
    standard: '512GB',
    pro: '1TB',
    ultra: '4TB'
  }, {
    feature: 'Satellite Conn.',
    standard: false,
    pro: false,
    ultra: true
  }];
  return <section className="py-24 bg-[#0a0a0f] relative">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white text-center">
            TECHNICAL{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
              SPECIFICATIONS
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="p-6 text-left text-gray-400 font-mono uppercase tracking-wider border-b border-white/10 w-1/4">
                  Feature
                </th>
                <th className="p-6 text-center text-white font-bold text-xl border-b border-white/10 w-1/4">
                  Standard
                </th>
                <th className="p-6 text-center text-[#00f0ff] font-bold text-xl border-b border-white/10 w-1/4 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#00f0ff] box-glow"></div>
                  Pro
                </th>
                <th className="p-6 text-center text-purple-400 font-bold text-xl border-b border-white/10 w-1/4">
                  Ultra
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {specs.map((row, index) => <motion.tr key={index} initial={{
              opacity: 0,
              x: -20
            }} whileInView={{
              opacity: 1,
              x: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="hover:bg-white/5 transition-colors">
                  <td className="p-6 text-gray-300 font-mono text-sm">
                    {row.feature}
                  </td>

                  {/* Standard Column */}
                  <td className="p-6 text-center text-gray-400 font-mono">
                    {typeof row.standard === 'boolean' ? row.standard ? <Check className="mx-auto text-green-500" /> : <X className="mx-auto text-gray-700" /> : row.standard}
                  </td>

                  {/* Pro Column */}
                  <td className="p-6 text-center text-white font-mono bg-[#00f0ff]/5 border-x border-[#00f0ff]/10">
                    {typeof row.pro === 'boolean' ? row.pro ? <Check className="mx-auto text-[#00f0ff]" /> : <X className="mx-auto text-gray-700" /> : row.pro}
                  </td>

                  {/* Ultra Column */}
                  <td className="p-6 text-center text-purple-300 font-mono">
                    {typeof row.ultra === 'boolean' ? row.ultra ? <Check className="mx-auto text-purple-500" /> : <X className="mx-auto text-gray-700" /> : row.ultra}
                  </td>
                </motion.tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </section>;
}