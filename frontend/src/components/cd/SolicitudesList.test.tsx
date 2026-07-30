import { render, screen, fireEvent } from '@testing-library/react';
import { SolicitudesList } from './SolicitudesList';
import { Solicitud } from '../../types/models';
import { describe, it, expect, vi } from 'vitest';

describe('SolicitudesList', () => {
  const solicitudes: Solicitud[] = [
    {
      id: 'sol-1',
      tipo: 'reserva',
      estado: 'pendiente',
      detalle: {},
      solicitanteName: 'Juan Perez',
      fechaCreacion: '2026-07-01T00:00:00Z',
    },
    {
      id: 'sol-2',
      tipo: 'actividad',
      estado: 'aprobado',
      detalle: {},
      solicitanteName: 'Ana Gomez',
      fechaCreacion: '2026-07-05T00:00:00Z',
    },
  ];

  it('shows loading state', () => {
    render(
      <SolicitudesList
        solicitudes={[]}
        isLoading={true}
        status="all"
        tipo="all"
        search=""
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Cargando solicitudes...')).toBeInTheDocument();
  });

  it('shows empty state when no solicitudes match', () => {
    render(
      <SolicitudesList
        solicitudes={[]}
        isLoading={false}
        status="all"
        tipo="all"
        search=""
        onSelect={vi.fn()}
      />,
    );
    expect(
      screen.getByText('No hay solicitudes que coincidan con los filtros seleccionados.'),
    ).toBeInTheDocument();
  });

  it('renders solicitudes sorted newest first', () => {
    render(
      <SolicitudesList
        solicitudes={solicitudes}
        isLoading={false}
        status="all"
        tipo="all"
        search=""
        onSelect={vi.fn()}
      />,
    );
    const cards = screen.getAllByRole('button');
    expect(cards[0]).toHaveTextContent('Ana Gomez');
    expect(cards[1]).toHaveTextContent('Juan Perez');
  });

  it('filters by status', () => {
    render(
      <SolicitudesList
        solicitudes={solicitudes}
        isLoading={false}
        status="pendiente"
        tipo="all"
        search=""
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.queryByText('Ana Gomez')).not.toBeInTheDocument();
  });

  it('filters by search text', () => {
    render(
      <SolicitudesList
        solicitudes={solicitudes}
        isLoading={false}
        status="all"
        tipo="all"
        search="ana"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
    expect(screen.queryByText('Juan Perez')).not.toBeInTheDocument();
  });

  it('calls onSelect when a card is clicked', () => {
    const onSelect = vi.fn();
    render(
      <SolicitudesList
        solicitudes={solicitudes}
        isLoading={false}
        status="all"
        tipo="all"
        search=""
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByTestId('solicitud-card-sol-1'));
    expect(onSelect).toHaveBeenCalledWith(solicitudes[0]);
  });
});
