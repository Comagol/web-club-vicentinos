import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-navy-950 via-navy-800 to-navy-600 flex items-center justify-center overflow-hidden">
      {/* Watermark Escudo (background) */}
      <div className="absolute bottom-0 right-0 opacity-[0.06] text-white text-9xl font-bold">
        V
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 md:px-12 max-w-2xl mx-auto">
        {/* Logo */}
        <div className="w-20 md:w-24 h-20 md:h-24 bg-gold-500 rounded-lg mx-auto mb-6 flex items-center justify-center">
          <span className="text-white text-4xl md:text-5xl font-bold">V</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl md:text-4xl font-700 text-white mb-4">
          Bienvenido al Club Vicentinos
        </h1>

        {/* Subheadline */}
        <p className="text-base md:text-xl font-400 text-white text-opacity-80 mb-8">
          Donde la pasión por el rugby y el hockey se encuentra con la comunidad
        </p>

        {/* CTA Button */}
        <button className="px-8 py-3 md:px-10 md:py-4 bg-gold-500 text-navy-800 font-600 text-sm md:text-base rounded-lg hover:opacity-88 transition-opacity">
          Conoce Más
        </button>
      </div>
    </div>
  );
};
