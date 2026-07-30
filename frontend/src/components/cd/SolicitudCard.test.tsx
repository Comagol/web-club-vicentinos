import { render, screen, fireEvent } from '@testing-library/react';
import { SolicitudCard } from './SolicitudCard';
import { Solicitud } from '../../types/models';
import { describe, it, expect, vi } from 'vitest';

describe('SolicitudCard', () => {
  const solicitud: Solicitud = {
    id: 'sol-1',
    tipo: 'reserva',
    estado: 'pendiente',
    detalle: { espacio: 'Cancha 1' },
    solicitanteName: 'Juan Perez',
    fechaCreacion: '2026-07-01T10:00:00Z',
  };

  it('renders requester name, type and status', () => {
    render(<SolicitudCard solicitud={solicitud} onClick={vi.fn()} />);
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Reserva')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('calls onClick with the solicitud when clicked', () => {
    const onClick = vi.fn();
    render(<SolicitudCard solicitud={solicitud} onClick={onClick} />);
    fireEvent.click(screen.getByTestId('solicitud-card-sol-1'));
    expect(onClick).toHaveBeenCalledWith(solicitud);
  });

  it('renders actividad type label', () => {
    render(
      <SolicitudCard
        solicitud={{ ...solicitud, tipo: 'actividad', estado: 'aprobado' }}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByText('Actividad')).toBeInTheDocument();
    expect(screen.getByText('Aprobado')).toBeInTheDocument();
  });

  it('renders espacios_subcomision type label', () => {
    render(
      <SolicitudCard
        solicitud={{ ...solicitud, tipo: 'espacios_subcomision', estado: 'rechazado' }}
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByText('Espacios')).toBeInTheDocument();
    expect(screen.getByText('Rechazado')).toBeInTheDocument();
  });
});
