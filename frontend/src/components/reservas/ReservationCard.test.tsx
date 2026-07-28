import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReservationCard } from './ReservationCard';
import { Reserva } from '../../types/models';
import { describe, it, expect, vi } from 'vitest';

const mockReserva: Reserva = {
  id: 'reserva-123',
  socioId: 'user-123',
  espacioId: 'espacio-1',
  fechaInicio: '2026-08-15',
  fechaFin: '2026-08-15',
  horaInicio: '10:00',
  horaFin: '11:00',
  notas: 'Test reservation',
  estado: 'pendiente',
  createdAt: '2026-07-28T00:00:00Z',
};

describe('ReservationCard', () => {
  it('renders reservation information correctly', () => {
    const mockOnCancel = vi.fn();

    render(
      <ReservationCard
        reserva={mockReserva}
        espacioName="Salón Principal"
        espacioCapacidad={100}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Salón Principal')).toBeInTheDocument();
    expect(screen.getByText('Capacidad: 100 personas')).toBeInTheDocument();
    expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('displays approved status badge', () => {
    const approvedReserva = { ...mockReserva, estado: 'aprobado' as const };
    const mockOnCancel = vi.fn();

    render(
      <ReservationCard
        reserva={approvedReserva}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Aprobado')).toBeInTheDocument();
  });

  it('displays rejected status badge', () => {
    const rejectedReserva = { ...mockReserva, estado: 'rechazado' as const, notaRechazo: 'No disponible' };
    const mockOnCancel = vi.fn();

    render(
      <ReservationCard
        reserva={rejectedReserva}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Rechazado')).toBeInTheDocument();
    expect(screen.getByText('No disponible')).toBeInTheDocument();
  });

  it('shows cancel button only for pending status', () => {
    const mockOnCancel = vi.fn();

    const { rerender } = render(
      <ReservationCard
        reserva={mockReserva}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Cancelar Reserva')).toBeInTheDocument();

    const approvedReserva = { ...mockReserva, estado: 'aprobado' as const };
    rerender(
      <ReservationCard
        reserva={approvedReserva}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Cancelar Reserva')).not.toBeInTheDocument();
  });

  it('shows confirmation modal on cancel click', () => {
    const mockOnCancel = vi.fn();

    render(
      <ReservationCard
        reserva={mockReserva}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar Reserva');
    fireEvent.click(cancelButton);

    const confirmHeadings = screen.getAllByText('Confirmar Cancelación');
    expect(confirmHeadings.length).toBeGreaterThan(0);
    expect(screen.getByText(/¿Estás seguro de que deseas cancelar/)).toBeInTheDocument();
  });

  it('calls onCancel when confirming cancellation', async () => {
    const mockOnCancel = vi.fn().mockResolvedValue(undefined);

    render(
      <ReservationCard
        reserva={mockReserva}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar Reserva');
    fireEvent.click(cancelButton);

    const confirmButtons = screen.getAllByText('Confirmar Cancelación');
    const confirmButton = confirmButtons.find((btn) => btn.tagName === 'BUTTON');
    fireEvent.click(confirmButton!);

    await waitFor(() => {
      expect(mockOnCancel).toHaveBeenCalledWith('reserva-123');
    });
  });

  it('closes modal when clicking "Mantener Reserva"', () => {
    const mockOnCancel = vi.fn();

    render(
      <ReservationCard
        reserva={mockReserva}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    const cancelButton = screen.getByText('Cancelar Reserva');
    fireEvent.click(cancelButton);

    let confirmHeadings = screen.getAllByText('Confirmar Cancelación');
    expect(confirmHeadings.length).toBeGreaterThan(0);

    const keepButton = screen.getByText('Mantener Reserva');
    fireEvent.click(keepButton);

    // After closing, should not find the heading in the modal
    confirmHeadings = screen.queryAllByText('Confirmar Cancelación');
    // Should still have 1 from the page title, but the modal should be gone
    expect(confirmHeadings.filter(el => el.classList.contains('text-h3'))).toHaveLength(0);
  });

  it('displays notes when present', () => {
    const mockOnCancel = vi.fn();

    render(
      <ReservationCard
        reserva={mockReserva}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('Test reservation')).toBeInTheDocument();
  });

  it('does not display notes when not present', () => {
    const reservaWithoutNotes = { ...mockReserva, notas: undefined };
    const mockOnCancel = vi.fn();

    render(
      <ReservationCard
        reserva={reservaWithoutNotes}
        espacioName="Salón A"
        espacioCapacidad={50}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.queryByText('Notas')).not.toBeInTheDocument();
  });
});
