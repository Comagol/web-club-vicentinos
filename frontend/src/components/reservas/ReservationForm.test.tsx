import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReservationForm } from './ReservationForm';
import { describe, it, expect, vi } from 'vitest';

const mockEspacios = [
  { id: '1', nombre: 'Salón A', capacidad: 50, descripcion: 'Salón principal', activo: true },
  { id: '2', nombre: 'Salón B', capacidad: 30, descripcion: 'Salón secundario', activo: true },
];

describe('ReservationForm', () => {
  it('renders form with all fields', () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate={null}
        selectedStartTime={null}
        selectedEndTime={null}
        selectedEspacioId={null}
        disponibilidad={null}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    expect(screen.getByText('Espacio *')).toBeInTheDocument();
    expect(screen.getByText('Fecha *')).toBeInTheDocument();
    expect(screen.getByText('Hora Inicio *')).toBeInTheDocument();
    expect(screen.getByText('Hora Fin *')).toBeInTheDocument();
    expect(screen.getByText('Notas (Opcional)')).toBeInTheDocument();
  });

  it('displays selected espacio in read-only format', () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate={null}
        selectedStartTime={null}
        selectedEndTime={null}
        selectedEspacioId="1"
        disponibilidad={null}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    expect(screen.getByText(/Salón A/)).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate={null}
        selectedStartTime={null}
        selectedEndTime={null}
        selectedEspacioId={null}
        disponibilidad={null}
        onSubmit={mockOnSubmit}
        loading={false}
        error="Error fetching data"
      />
    );

    expect(screen.getByText('Error fetching data')).toBeInTheDocument();
  });

  it('shows loading state on submit button', () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="08:00"
        selectedEndTime="09:00"
        selectedEspacioId="1"
        disponibilidad={['08:00', '08:30']}
        onSubmit={mockOnSubmit}
        loading={true}
        error={null}
      />
    );

    const submitButton = screen.getByText('Procesando...');
    expect(submitButton).toBeDisabled();
  });

  it('validates required fields', async () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate={null}
        selectedStartTime={null}
        selectedEndTime={null}
        selectedEspacioId={null}
        disponibilidad={null}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Reservar Espacio/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El espacio es requerido/)).toBeInTheDocument();
      expect(screen.getByText(/La fecha es requerida/)).toBeInTheDocument();
      expect(screen.getByText(/La hora de inicio es requerida/)).toBeInTheDocument();
      expect(screen.getByText(/La hora de fin es requerida/)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates end time is after start time', async () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="09:00"
        selectedEndTime="08:00"
        selectedEspacioId="1"
        disponibilidad={['09:00']}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Reservar Espacio/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/La hora de fin debe ser mayor/)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="08:00"
        selectedEndTime="09:00"
        selectedEspacioId="1"
        disponibilidad={['08:00', '08:30']}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Reservar Espacio/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });

    const callData = mockOnSubmit.mock.calls[0][0];
    expect(callData.espacioId).toBe('1');
    expect(callData.fechaInicio).toBe('2026-08-01');
    expect(callData.horaInicio).toBe('08:00');
    expect(callData.horaFin).toBe('09:00');
  });

  it('syncs espacio from prop', () => {
    const mockOnSubmit = vi.fn();
    const { rerender } = render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="08:00"
        selectedEndTime="09:00"
        selectedEspacioId="1"
        disponibilidad={['08:00']}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    expect(screen.getByText(/Salón A/)).toBeInTheDocument();

    rerender(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="08:00"
        selectedEndTime="09:00"
        selectedEspacioId="2"
        disponibilidad={['08:00']}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    expect(screen.getByText(/Salón B/)).toBeInTheDocument();
  });

  it('accepts notes field', () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="08:00"
        selectedEndTime="09:00"
        selectedEspacioId="1"
        disponibilidad={['08:00']}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const notesField = screen.getByPlaceholderText(/Agregue cualquier comentario/);
    expect(notesField).toBeInTheDocument();
  });

  it('validates that time is in availability', async () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="09:00"
        selectedEndTime="10:00"
        selectedEspacioId="1"
        disponibilidad={['08:00', '08:30']}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Reservar Espacio/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El horario seleccionado no está disponible/)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
