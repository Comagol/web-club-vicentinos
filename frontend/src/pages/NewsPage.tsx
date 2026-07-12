import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const NewsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 py-12 md:py-16">
        <h3 className="text-2xl md:text-3xl font-600 text-navy-900">
          Noticias
        </h3>
      </main>
      <Footer />
    </div>
  );
};
