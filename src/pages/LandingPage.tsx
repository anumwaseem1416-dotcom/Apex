import React from 'react';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { ProductShowcase } from '../components/ProductShowcase';
import { TechSpecs } from '../components/TechSpecs';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';
import { Newsletter } from '../components/Newsletter';
import { Contact } from '../components/Contact';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Hero />
      <Features />
      <ProductShowcase />
      <TechSpecs />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Contact />
    </div>
  );
};

export default LandingPage;