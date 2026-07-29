import React from 'react';
import { Actividad } from '../../types/models';
import { ActivityCard } from './ActivityCard';
import { ActivityStatusFilter } from './ActivityFilterBar';

interface ActivitiesListProps {
  actividades: Actividad[];
  selectedStatus: ActivityStatusFilter;
  onActivityClick: (actividadId: string) => void;
  loading?: boolean;
  error?: string | null;
}

export const ActivitiesList: React.FC<ActivitiesListProps> = ({
  actividades,
  selectedStatus,
  onActivityClick,
  loading = false,
  error = null,
}) => {
  // Filter activities based on selected status
  const filteredActividades =
    selectedStatus === 'all'
      ? actividades
      : actividades.filter((act) => act.estado === selectedStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-600">Cargando actividades...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-danger-text">Error al cargar actividades</p>
      </div>
    );
  }

  if (filteredActividades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-neutral-600 text-body mb-2">
          No hay actividades disponibles
        </p>
        <p className="text-neutral-500 text-body-small">
          {selectedStatus !== 'all'
            ? `No hay actividades ${selectedStatus}`
            : 'Por favor, intenta más tarde'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
      {filteredActividades.map((actividad) => (
        <ActivityCard
          key={actividad.id}
          actividad={actividad}
          onClick={onActivityClick}
        />
      ))}
    </div>
  );
};
