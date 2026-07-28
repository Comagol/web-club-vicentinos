import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Reserva } from '../../types/models';

interface ReservationCardProps {
  reserva: Reserva;
  espacioName: string;
  espacioCapacidad: number;
  onCancel: (reservaId: string) => Promise<void>;
  isLoading?: boolean;
}

export const ReservationCard: React.FC<ReservationCardProps> = ({
  reserva,
  espacioName,
  espacioCapacidad,
  onCancel,
  isLoading = false,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const getStatusBadgeVariant = (
    status: 'pendiente' | 'aprobado' | 'rechazado'
  ): 'pending' | 'active' | 'inactive' => {
    switch (status) {
      case 'pendiente':
        return 'pending';
      case 'aprobado':
        return 'active';
      case 'rechazado':
        return 'inactive';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status: 'pendiente' | 'aprobado' | 'rechazado') => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente';
      case 'aprobado':
        return 'Aprobado';
      case 'rechazado':
        return 'Rechazado';
      default:
        return 'Desconocido';
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
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handleCancelClick = async () => {
    setIsCancelling(true);
    try {
      await onCancel(reserva.id);
      setShowConfirmation(false);
    } catch (err) {
      console.error('Error cancelling reservation:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const canCancel = reserva.estado === 'pendiente';

  return (
    <>
      <Card className="mb-lg hover:shadow-md transition-shadow">
        <Card.Body className="p-lg">
          {/* Header with status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-h3 font-600 text-navy-800 mb-1">
                {espacioName}
              </h3>
              <p className="text-caption text-neutral-600">
                Capacidad: {espacioCapacidad} personas
              </p>
            </div>
            <Badge variant={getStatusBadgeVariant(reserva.estado)}>
              {getStatusLabel(reserva.estado)}
            </Badge>
          </div>

          {/* Date and Time Info */}
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-neutral-200">
            <div>
              <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
                Fecha
              </p>
              <p className="text-body font-600 text-navy-800">
                {formatDate(reserva.fechaInicio)}
              </p>
            </div>
            <div>
              <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
                Hora
              </p>
              <p className="text-body font-600 text-navy-800">
                {reserva.horaInicio} - {reserva.horaFin}
              </p>
            </div>
          </div>

          {/* Notes if present */}
          {reserva.notas && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <p className="text-caption text-neutral-600 font-500 uppercase mb-1">
                Notas
              </p>
              <p className="text-body text-neutral-700">{reserva.notas}</p>
            </div>
          )}

          {/* Rejection reason if rejected */}
          {reserva.estado === 'rechazado' && reserva.notaRechazo && (
            <div className="mt-4 pt-4 border-t border-neutral-200 bg-danger-bg rounded-md p-3">
              <p className="text-caption text-danger-text font-500 uppercase mb-1">
                Motivo del Rechazo
              </p>
              <p className="text-body text-danger-text">{reserva.notaRechazo}</p>
            </div>
          )}

          {/* Cancel Button */}
          {canCancel && (
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <button
                onClick={() => setShowConfirmation(true)}
                disabled={isCancelling || isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-danger-bg text-danger-text rounded-btn font-600 hover:bg-danger-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                Cancelar Reserva
              </button>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <Card.Body className="p-lg">
              <h3 className="text-h3 font-600 text-navy-800 mb-2">
                Confirmar Cancelación
              </h3>
              <p className="text-body text-neutral-700 mb-6">
                ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2 border-[0.5px] border-neutral-300 text-navy-800 rounded-btn font-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
                >
                  Mantener Reserva
                </button>
                <button
                  onClick={handleCancelClick}
                  disabled={isCancelling}
                  className="flex-1 px-4 py-2 bg-danger-text text-white rounded-btn font-600 hover:bg-danger-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCancelling ? 'Cancelando...' : 'Confirmar Cancelación'}
                </button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};
