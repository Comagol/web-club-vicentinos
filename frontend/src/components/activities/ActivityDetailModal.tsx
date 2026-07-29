import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Banner } from '../ui/Banner';
import { Actividad } from '../../types/models';

interface ActivityDetailModalProps {
  actividad: Actividad;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (actividadId: string) => Promise<void>;
  isEnrolling?: boolean;
  enrollmentError?: string | null;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  actividad,
  isOpen,
  onClose,
  onEnroll,
  isEnrolling = false,
  enrollmentError = null,
}) => {
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const spotsAvailable = actividad.limitePlazas - actividad.inscriptosCount;
  const isFull = spotsAvailable <= 0;
  const isOpen_status = actividad.estado === 'abierta';
  const canEnroll = isOpen_status && !isFull && !isEnrolling;

  const handleEnroll = async () => {
    try {
      setLocalError(null);
      setSuccessMessage(null);
      await onEnroll(actividad.id);
      setSuccessMessage('¡Inscripción exitosa!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error during enrollment');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white flex items-center justify-between px-lg py-md border-b-[0.5px] border-neutral-300">
            <h2 className="text-h2 font-semibold text-navy-800 line-clamp-1">
              {actividad.nombre}
            </h2>
            <button
              onClick={onClose}
              className="p-0 hover:opacity-90 transition-opacity"
              aria-label="Close modal"
            >
              <X size={24} className="text-neutral-700" />
            </button>
          </div>

          <Card.Body className="p-lg space-y-lg">
            {/* Status Badge */}
            <div>
              <Badge variant={getStatusBadgeVariant(actividad.estado)}>
                {getStatusLabel(actividad.estado)}
              </Badge>
            </div>

            {/* Error Messages */}
            {(enrollmentError || localError) && (
              <Banner type="danger">
                <div className="space-y-xs">
                  <p className="font-600">Error en la Inscripción</p>
                  <p className="text-body-small">
                    {enrollmentError || localError}
                  </p>
                </div>
              </Banner>
            )}

            {/* Success Message */}
            {successMessage && (
              <Banner type="success">
                <div className="space-y-xs">
                  <p className="font-600">Éxito</p>
                  <p className="text-body-small">{successMessage}</p>
                </div>
              </Banner>
            )}

            {/* Description */}
            <div>
              <h3 className="text-label font-600 text-neutral-700 mb-md">
                Descripción
              </h3>
              <p className="text-body text-neutral-700 leading-relaxed">
                {actividad.descripcion}
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <p className="text-caption text-neutral-600 font-500 uppercase mb-md">
                  Fecha de Inicio
                </p>
                <p className="text-body font-600 text-navy-800">
                  {formatDate(actividad.fechaInicio)}
                </p>
              </div>
              <div>
                <p className="text-caption text-neutral-600 font-500 uppercase mb-md">
                  Fecha de Fin
                </p>
                <p className="text-body font-600 text-navy-800">
                  {formatDate(actividad.fechaFin)}
                </p>
              </div>
            </div>

            {/* Capacity and Enrollment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div>
                <p className="text-caption text-neutral-600 font-500 uppercase mb-md">
                  Plazas Disponibles
                </p>
                <p
                  className={`text-h2 font-600 ${
                    spotsAvailable > 0 ? 'text-success-text' : 'text-danger-text'
                  }`}
                >
                  {spotsAvailable}
                </p>
                <p className="text-caption text-neutral-600 mt-1">
                  Total: {actividad.limitePlazas} plazas
                </p>
              </div>
              <div>
                <p className="text-caption text-neutral-600 font-500 uppercase mb-md">
                  Inscritos
                </p>
                <p className="text-h2 font-600 text-navy-800">
                  {actividad.inscriptosCount}
                </p>
                <div className="mt-2 w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500 transition-all"
                    style={{
                      width: `${Math.min(
                        (actividad.inscriptosCount /
                          actividad.limitePlazas) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-neutral-50 rounded-card p-lg border-[0.5px] border-neutral-200">
              <p className="text-caption text-neutral-600 font-500 uppercase mb-2">
                Cuota de Participación
              </p>
              <p className="text-h2 font-600 text-gold-500">
                ${actividad.cuota.toFixed(2)}
              </p>
            </div>

            {/* Enrollment Button */}
            <div className="flex gap-3 pt-lg border-t border-neutral-200">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border-[0.5px] border-neutral-300 text-navy-800 rounded-btn font-600 hover:bg-neutral-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={handleEnroll}
                disabled={!canEnroll}
                className={`flex-1 px-4 py-3 rounded-btn font-600 transition-all ${
                  canEnroll
                    ? 'bg-gold-500 text-navy-800 hover:opacity-90'
                    : 'bg-neutral-300 text-neutral-600 cursor-not-allowed'
                }`}
              >
                {isEnrolling ? 'Inscribiendo...' : 'Inscribirse'}
              </button>
            </div>

            {/* Info Messages */}
            {isFull && isOpen_status && (
              <p className="text-caption text-danger-text text-center">
                Esta actividad está llena. No hay plazas disponibles.
              </p>
            )}

            {!isOpen_status && (
              <p className="text-caption text-warning-text text-center">
                Esta actividad no está abierta para inscripciones.
              </p>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};
