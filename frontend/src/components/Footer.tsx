import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CLUB_INFO } from '../constants/mockData';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-navy-950 text-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Club Info */}
          <div>
            <h3 className="text-base font-600 text-white mb-4">
              {CLUB_INFO.name}
            </h3>
            <p className="text-xs text-gray-300 mb-2">{CLUB_INFO.location}</p>
            <p className="text-xs text-gray-400">
              Desde {CLUB_INFO.founded}
            </p>
          </div>

          {/* Disciplinas */}
          <div>
            <h3 className="text-xs font-500 uppercase text-white mb-4 tracking-wider">
              Disciplinas
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/teams')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Rugby
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/teams')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Hockey
                </button>
              </li>
            </ul>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-xs font-500 uppercase text-white mb-4 tracking-wider">
              Navegación
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/news')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Noticias
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/teams')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Equipos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/boutique')}
                  className="text-xs text-gray-300 hover:text-gold-500 transition-colors"
                >
                  Boutique
                </button>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-xs font-500 uppercase text-white mb-4 tracking-wider">
              Contacto
            </h3>
            <ul className="space-y-2">
              <li className="text-xs text-gray-300">{CLUB_INFO.email}</li>
              <li className="text-xs text-gray-300">{CLUB_INFO.phone}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-navy-800 max-w-7xl mx-auto px-6 py-6">
        <p className="text-center text-xs text-gray-500">
          © 2026 Club Vicentinos. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};
