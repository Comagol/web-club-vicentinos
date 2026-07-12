import React from 'react';
import { MOCK_NEWS, formatRelativeDate } from '../../constants/mockData';

export const NewsSection: React.FC = () => {
  return (
    <section className="w-full bg-white py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-600 text-navy-900 mb-2">
            Últimas Noticias
          </h2>
          <p className="text-sm md:text-base font-400 text-gray-600">
            Entérate de lo que sucede en el club
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MOCK_NEWS.map((article) => (
            <div
              key={article.id}
              className="bg-white border border-gray-300 rounded-xl p-4 md:p-5 hover:shadow-lg transition-shadow"
            >
              {/* Date Badge */}
              <p className="text-xs font-500 text-gray-500 mb-2">
                {formatRelativeDate(article.date)}
              </p>

              {/* Title */}
              <h3 className="text-base md:text-lg font-600 text-navy-900 mb-2 line-clamp-2">
                {article.title}
              </h3>

              {/* Description */}
              <p className="text-xs md:text-sm font-400 text-gray-700 mb-4 line-clamp-3">
                {article.description}
              </p>

              {/* Read More Link */}
              <a href="#" className="text-xs md:text-sm font-500 text-gold-500 hover:text-gold-700">
                Leer más →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
