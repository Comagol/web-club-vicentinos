import React from 'react';
import { EspacioCard } from './EspacioCard';
import { Espacio } from '../../types/models';

interface EspaciosListProps {
  espacios: Espacio[];
  loading: boolean;
  error?: string | null;
  onSelectEspacio: (espacio: Espacio) => void;
}

export const EspaciosList: React.FC<EspaciosListProps> = ({
  espacios,
  loading,
  error,
  onSelectEspacio,
}) => {
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-500">Error al cargar espacios</p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-lg border border-neutral-300 animate-pulse"
          >
            <div className="h-6 bg-neutral-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-neutral-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!espacios || espacios.length === 0) {
    return (
      <div className="p-8 text-center bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="text-neutral-600 font-500">No hay espacios disponibles</p>
        <p className="text-sm text-neutral-500 mt-1">
          Contacta con administración para agregar espacios
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {espacios.map((espacio) => (
        <EspacioCard
          key={espacio.id}
          espacio={espacio}
          bookingsCount={0}
          onDetailClick={onSelectEspacio}
        />
      ))}
    </div>
  );
};
