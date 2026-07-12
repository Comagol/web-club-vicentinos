import React from 'react';
import { DISCIPLINES } from '../../constants/mockData';
import { Trophy } from 'lucide-react';

export const DisciplinesSection: React.FC = () => {
  const disciplines = Object.values(DISCIPLINES);

  return (
    <section className="w-full bg-navy-50 py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-600 text-navy-900">
            Nuestras Disciplinas
          </h2>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {disciplines.map((discipline) => (
            <div
              key={discipline.name}
              className="bg-white rounded-xl p-6 md:p-8 border border-gray-300"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gold-500 rounded-lg flex items-center justify-center mb-4">
                <Trophy size={24} className="text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-600 text-navy-900 mb-3">
                {discipline.name}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base font-400 text-gray-700 mb-6">
                {discipline.description}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-700 text-gold-500">
                    {discipline.stats.teams}
                  </p>
                  <p className="text-xs md:text-sm font-500 text-gray-600">
                    Equipos
                  </p>
                </div>
                <div className="text-center border-l border-r border-gray-300">
                  <p className="text-xl md:text-2xl font-700 text-gold-500">
                    {discipline.stats.players}
                  </p>
                  <p className="text-xs md:text-sm font-500 text-gray-600">
                    Jugadores
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-700 text-gold-500">
                    {discipline.stats.titles}
                  </p>
                  <p className="text-xs md:text-sm font-500 text-gray-600">
                    Títulos
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
