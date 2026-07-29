import React from 'react';
import { ChevronRight, Users } from 'lucide-react';
import { Espacio } from '../../types/models';

interface EspacioCardProps {
  espacio: Espacio;
  bookingsCount?: number;
  onDetailClick: (espacio: Espacio) => void;
}

export const EspacioCard: React.FC<EspacioCardProps> = ({
  espacio,
  bookingsCount = 0,
  onDetailClick,
}) => {
  return (
    <button
      onClick={() => onDetailClick(espacio)}
      className="w-full p-4 bg-white rounded-lg border-[0.5px] border-neutral-300 hover:shadow-md transition-shadow text-left"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-600 text-navy-800 line-clamp-2">{espacio.nombre}</h3>
          {espacio.activo ? (
            <span className="flex-shrink-0 px-2 py-1 text-xs font-500 bg-green-100 text-green-700 rounded">
              Activo
            </span>
          ) : (
            <span className="flex-shrink-0 px-2 py-1 text-xs font-500 bg-red-100 text-red-700 rounded">
              Inactivo
            </span>
          )}
        </div>

        <p className="text-sm text-neutral-600 line-clamp-2">
          {espacio.descripcion || 'Sin descripción'}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
          <div className="flex items-center gap-2 text-neutral-700">
            <Users size={16} />
            <span className="text-sm font-500">Capacidad: {espacio.capacidad}</span>
          </div>
          <span className="text-xs text-neutral-500">{bookingsCount} reservas</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-navy-800 font-500">Ver detalles</span>
          <ChevronRight size={16} className="text-navy-800" />
        </div>
      </div>
    </button>
  );
};
