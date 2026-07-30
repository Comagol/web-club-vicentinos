import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RequestDetailModal } from './RequestDetailModal';
import { Solicitud } from '../../types/models';
import * as api from '../../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../services/api');

describe('RequestDetailModal', () => {
  const solicitud: Solicitud = {
    id: 'sol-1',
    tipo: 'reserva',
    estado: 'pendiente',
    detalle: { espacio: 'Cancha 1', horario: '10:00' },
    solicitanteName: 'Juan Perez',
    fechaCreacion: '2026-07-01T10:00:00Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders request details', () => {
    render(
      <RequestDetailModal solicitud={solicitud} isOpen={true} onClose={vi.fn()} onUpdated={vi.fn()} />,
    );
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText(/Cancha 1/)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <RequestDetailModal solicitud={solicitud} isOpen={false} onClose={vi.fn()} onUpdated={vi.fn()} />,
    );
    expect(screen.queryByText('Juan Perez')).not.toBeInTheDocument();
  });

  it('approves a solicitud and calls onUpdated', async () => {
    const approved = { ...solicitud, estado: 'aprobado' as const };
    vi.spyOn(api.solicitudService, 'aprobarSolicitud').mockResolvedValueOnce({
      data: { data: approved },
    } as any);

    const onUpdated = vi.fn();
    render(
      <RequestDetailModal solicitud={solicitud} isOpen={true} onClose={vi.fn()} onUpdated={onUpdated} />,
    );

    fireEvent.click(screen.getByText('Aprobar'));

    await waitFor(() => {
      expect(onUpdated).toHaveBeenCalledWith(approved);
    });
    expect(screen.getByText('Solicitud aprobada correctamente.')).toBeInTheDocument();
  });

  it('shows note field and rejects with a note', async () => {
    const rejected = { ...solicitud, estado: 'rechazado' as const, notaRechazo: 'no disponible' };
    vi.spyOn(api.solicitudService, 'rechazarSolicitud').mockResolvedValueOnce({
      data: { data: rejected },
    } as any);

    const onUpdated = vi.fn();
    render(
      <RequestDetailModal solicitud={solicitud} isOpen={true} onClose={vi.fn()} onUpdated={onUpdated} />,
    );

    fireEvent.click(screen.getByText('Rechazar'));
    expect(screen.getByLabelText('Motivo de rechazo')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Motivo de rechazo'), {
      target: { value: 'no disponible' },
    });
    fireEvent.click(screen.getByText('Confirmar rechazo'));

    await waitFor(() => {
      expect(onUpdated).toHaveBeenCalledWith(rejected);
    });
    expect(api.solicitudService.rechazarSolicitud).toHaveBeenCalledWith('sol-1', 'no disponible');
  });

  it('hides action buttons when solicitud is not pendiente', () => {
    render(
      <RequestDetailModal
        solicitud={{ ...solicitud, estado: 'aprobado' }}
        isOpen={true}
        onClose={vi.fn()}
        onUpdated={vi.fn()}
      />,
    );
    expect(screen.queryByText('Aprobar')).not.toBeInTheDocument();
    expect(screen.queryByText('Rechazar')).not.toBeInTheDocument();
    expect(screen.getByText('Cerrar')).toBeInTheDocument();
  });
});
