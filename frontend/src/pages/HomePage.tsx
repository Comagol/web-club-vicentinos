import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { NewsSection } from '../components/home/NewsSection';
import { DisciplinesSection } from '../components/home/DisciplinesSection';
import { BoutiquePreview } from '../components/home/BoutiquePreview';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <NewsSection />
        <DisciplinesSection />
        <BoutiquePreview />
      </main>
      <Footer />
    </div>
  );
};
