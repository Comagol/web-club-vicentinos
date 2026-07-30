import React, { useState, useEffect } from 'react';
import { Solicitud } from '../../types/models';
import { useSolicitudDetail } from '../../hooks/useSolicitudDetail';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { FormInput } from '../ui/FormInput';
import { Banner } from '../ui/Banner';

interface RequestDetailModalProps {
  solicitud: Solicitud | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (solicitud: Solicitud) => void;
}

const tipoLabels: Record<Solicitud['tipo'], string> = {
  reserva: 'Reserva',
  actividad: 'Actividad',
  espacios_subcomision: 'Espacios (Subcomisión)',
};

const estadoLabels: Record<Solicitud['estado'], string> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleString('es-AR');
  } catch {
    return dateStr;
  }
};

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  solicitud,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const { solicitud: current, isLoading, error, aprobar, rechazar } = useSolicitudDetail(solicitud);
  const [isRejecting, setIsRejecting] = useState(false);
  const [nota, setNota] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsRejecting(false);
    setNota('');
    setSuccessMessage(null);
  }, [solicitud?.id]);

  if (!isOpen || !current) {
    return null;
  }

  const handleAprobar = async () => {
    setSuccessMessage(null);
    try {
      const updated = await aprobar();
      setSuccessMessage('Solicitud aprobada correctamente.');
      onUpdated(updated);
    } catch {
      // error state handled by hook
    }
  };

  const handleRechazarClick = () => {
    setSuccessMessage(null);
    setIsRejecting(true);
  };

  const handleConfirmRechazar = async () => {
    setSuccessMessage(null);
    try {
      const updated = await rechazar(nota);
      setSuccessMessage('Solicitud rechazada correctamente.');
      setIsRejecting(false);
      onUpdated(updated);
    } catch {
      // error state handled by hook
    }
  };

  const isPendiente = current.estado === 'pendiente';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle de la solicitud">
      <div className="space-y-4" data-testid="request-detail-modal">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-neutral-500 uppercase font-semibold">Solicitante</p>
            <p className="text-body text-neutral-900">{current.solicitanteName}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase font-semibold">Tipo</p>
            <p className="text-body text-neutral-900">{tipoLabels[current.tipo]}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase font-semibold">Estado</p>
            <p className="text-body text-neutral-900">{estadoLabels[current.estado]}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase font-semibold">Fecha</p>
            <p className="text-body text-neutral-900">{formatDate(current.fechaCreacion)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-neutral-500 uppercase font-semibold mb-2">Detalle</p>
          <pre className="bg-neutral-100 rounded-btn p-3 text-caption text-neutral-700 overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(current.detalle, null, 2)}
          </pre>
        </div>

        {current.notaRechazo && (
          <div>
            <p className="text-xs text-neutral-500 uppercase font-semibold mb-1">
              Motivo de rechazo
            </p>
            <p className="text-body text-neutral-900">{current.notaRechazo}</p>
          </div>
        )}

        {successMessage && <Banner type="success">{successMessage}</Banner>}
        {error && <Banner type="danger">{error}</Banner>}

        {isRejecting && (
          <FormInput
            label="Motivo de rechazo"
            placeholder="Indique el motivo del rechazo..."
            value={nota}
            onChange={(e) => setNota(e.target.value)}
          />
        )}

        {isPendiente && (
          <div className="flex justify-end gap-3 pt-2">
            {isRejecting ? (
              <>
                <Button variant="ghost" onClick={() => setIsRejecting(false)} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleConfirmRechazar} disabled={isLoading}>
                  Confirmar rechazo
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                  Cancelar
                </Button>
                <Button variant="danger" onClick={handleRechazarClick} disabled={isLoading}>
                  Rechazar
                </Button>
                <Button variant="success" onClick={handleAprobar} disabled={isLoading}>
                  Aprobar
                </Button>
              </>
            )}
          </div>
        )}

        {!isPendiente && (
          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
