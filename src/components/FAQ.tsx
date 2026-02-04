import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
const faqs = [{
  question: 'Do you ship to Mars colonies?',
  answer: 'Yes, we offer interplanetary shipping via SpaceX Heavy Cargo. Delivery typically takes 3-4 months depending on orbital alignment.'
}, {
  question: 'Is the neural link compatible with older brain implants?',
  answer: 'Our devices support Neural Link v2.0 and above. Legacy implants may require a firmware update or a bridge adapter.'
}, {
  question: 'What is the warranty period?',
  answer: 'All APEX devices come with a standard 2-year galactic warranty. This covers hardware defects and software malfunctions.'
}, {
  question: 'Can I trade in my old device?',
  answer: 'Absolutely. We offer competitive trade-in values for all major brands. The credit is instantly applied to your new purchase.'
}, {
  question: 'How secure is the biometric lock?',
  answer: 'Our DNA-sequence locking mechanism has a false acceptance rate of 1 in 10 billion. It is currently the most secure consumer-grade lock available.'
}];
export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  return <section className="py-24 bg-[#050508]">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white text-center">
          FREQUENTLY ASKED <span className="text-[#00f0ff]">QUESTIONS</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => <div key={index} className="border border-white/10 rounded-lg bg-white/5 overflow-hidden transition-colors hover:border-[#00f0ff]/30">
              <button onClick={() => setActiveIndex(activeIndex === index ? null : index)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none">
                <span className={`font-bold text-lg transition-colors ${activeIndex === index ? 'text-[#00f0ff]' : 'text-white'}`}>
                  {faq.question}
                </span>
                <ChevronDown className={`text-gray-400 transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-[#00f0ff]' : ''}`} />
              </button>

              <AnimatePresence>
                {activeIndex === index && <motion.div initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} transition={{
              duration: 0.3
            }}>
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>}
              </AnimatePresence>
            </div>)}
        </div>
      </div>
    </section>;
}