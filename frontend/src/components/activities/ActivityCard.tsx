import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Actividad } from '../../types/models';

interface ActivityCardProps {
  actividad: Actividad;
  onClick: (actividadId: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  actividad,
  onClick,
}) => {
  const getStatusBadgeVariant = (
    status: 'abierta' | 'cerrada' | 'cancelada'
  ): 'active' | 'inactive' | 'gray' => {
    switch (status) {
      case 'abierta':
        return 'active';
      case 'cerrada':
        return 'inactive';
      case 'cancelada':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: 'abierta' | 'cerrada' | 'cancelada') => {
    switch (status) {
      case 'abierta':
        return 'Abierta';
      case 'cerrada':
        return 'Cerrada';
      case 'cancelada':
        return 'Cancelada';
      default:
        return 'Desconocida';
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const months = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic',
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const spotsAvailable = actividad.limitePlazas - actividad.inscriptosCount;
  const capacityPercentage =
    (actividad.inscriptosCount / actividad.limitePlazas) * 100;

  return (
    <Card
      className="h-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(actividad.id)}
    >
      <Card.Body className="p-lg">
        {/* Header with status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-h3 font-600 text-navy-800 line-clamp-2">
              {actividad.nombre}
            </h3>
          </div>
          <Badge variant={getStatusBadgeVariant(actividad.estado)}>
            {getStatusLabel(actividad.estado)}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-body-small text-neutral-600 line-clamp-2 mb-4">
          {actividad.descripcion}
        </p>

        {/* Date Range */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-neutral-200">
          <span className="text-caption text-neutral-600">
            {formatDate(actividad.fechaInicio)} -{' '}
            {formatDate(actividad.fechaFin)}
          </span>
        </div>

        {/* Capacity Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-caption text-neutral-600">Plazas</span>
            <span className="text-caption font-600 text-navy-800">
              {actividad.inscriptosCount}/{actividad.limitePlazas}
            </span>
          </div>
          <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-500 transition-all"
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Price and Availability */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div>
            <p className="text-caption text-neutral-600">Cuota</p>
            <p className="text-h3 font-600 text-gold-500">
              ${actividad.cuota.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-caption text-neutral-600">Disponibles</p>
            <p
              className={`text-h3 font-600 ${
                spotsAvailable > 0 ? 'text-success-text' : 'text-danger-text'
              }`}
            >
              {spotsAvailable}
            </p>
          </div>
        </div>

        {/* View Details Button */}
        <button
          className="w-full mt-4 px-4 py-2 bg-navy-800 text-white rounded-btn font-600 hover:bg-navy-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={(e) => {
            e.stopPropagation();
            onClick(actividad.id);
          }}
        >
          Ver Detalles
        </button>
      </Card.Body>
    </Card>
  );
};
