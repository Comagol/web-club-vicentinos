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

  it('displays espacio options', () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate={null}
        selectedStartTime={null}
        selectedEndTime={null}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const espacio1 = screen.getByText(/Salón A/);
    const espacio2 = screen.getByText(/Salón B/);

    expect(espacio1).toBeInTheDocument();
    expect(espacio2).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate={null}
        selectedStartTime={null}
        selectedEndTime={null}
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
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const espacioSelect = screen.getByRole('combobox') as HTMLSelectElement;
    fireEvent.change(espacioSelect, { target: { value: '1' } });

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

  it('updates form fields when selected values change', () => {
    const mockOnSubmit = vi.fn();
    const { rerender } = render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="08:00"
        selectedEndTime="09:00"
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const dateInputs = screen.getAllByDisplayValue('2026-08-01');
    expect(dateInputs.length > 0).toBe(true);

    rerender(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-02"
        selectedStartTime="09:00"
        selectedEndTime="10:00"
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const updatedInputs = screen.getAllByDisplayValue('2026-08-02');
    expect(updatedInputs.length > 0).toBe(true);
  });

  it('clears error when user interacts with field', async () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate={null}
        selectedStartTime={null}
        selectedEndTime={null}
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    // Submit to trigger validation
    const submitButton = screen.getByRole('button', { name: /Reservar Espacio/ });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El espacio es requerido/)).toBeInTheDocument();
    });

    // Change the espacio field
    const espacioSelect = screen.getByRole('combobox');
    fireEvent.change(espacioSelect, { target: { value: '1' } });

    // Error for espacio field should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/El espacio es requerido/)).not.toBeInTheDocument();
    });
  });

  it('accepts notes field', () => {
    const mockOnSubmit = vi.fn();
    render(
      <ReservationForm
        espacios={mockEspacios}
        selectedDate="2026-08-01"
        selectedStartTime="08:00"
        selectedEndTime="09:00"
        onSubmit={mockOnSubmit}
        loading={false}
        error={null}
      />
    );

    const notesField = screen.getByPlaceholderText(/Agregue cualquier comentario/);
    expect(notesField).toBeInTheDocument();
  });
});
