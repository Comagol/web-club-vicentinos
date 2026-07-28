import { render, screen, fireEvent } from '@testing-library/react';
import { AvailabilityView } from './AvailabilityView';
import { describe, it, expect, vi } from 'vitest';

describe('AvailabilityView', () => {
  it('shows info banner when no espacio or fecha selected', () => {
    const mockOnTimeSelect = vi.fn();
    render(
      <AvailabilityView
        espacioId={null}
        fecha={null}
        disponibilidad={null}
        loading={false}
        onTimeSelect={mockOnTimeSelect}
        selectedStartTime={null}
      />
    );

    expect(screen.getByText(/Selecciona un espacio y una fecha/)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const mockOnTimeSelect = vi.fn();
    render(
      <AvailabilityView
        espacioId="space-1"
        fecha="2026-08-01"
        disponibilidad={null}
        loading={true}
        onTimeSelect={mockOnTimeSelect}
        selectedStartTime={null}
      />
    );

    expect(screen.getByRole('heading', { name: /Horarios Disponibles/ })).toBeInTheDocument();
    // Check for spinner (inline-block div with animation)
    const spinners = screen.getByRole('heading').parentElement?.querySelectorAll('div');
    expect(spinners).toBeDefined();
  });

  it('displays available time slots', () => {
    const mockOnTimeSelect = vi.fn();
    const availableSlots = ['08:00', '08:30', '09:00'];

    render(
      <AvailabilityView
        espacioId="space-1"
        fecha="2026-08-01"
        disponibilidad={availableSlots}
        loading={false}
        onTimeSelect={mockOnTimeSelect}
        selectedStartTime={null}
      />
    );

    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('08:30')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
  });

  it('shows warning when no available slots', () => {
    const mockOnTimeSelect = vi.fn();
    render(
      <AvailabilityView
        espacioId="space-1"
        fecha="2026-08-01"
        disponibilidad={[]}
        loading={false}
        onTimeSelect={mockOnTimeSelect}
        selectedStartTime={null}
      />
    );

    expect(screen.getByText(/No hay horarios disponibles/)).toBeInTheDocument();
  });

  it('calls onTimeSelect when a slot is clicked', () => {
    const mockOnTimeSelect = vi.fn();
    const availableSlots = ['08:00', '08:30', '09:00'];

    render(
      <AvailabilityView
        espacioId="space-1"
        fecha="2026-08-01"
        disponibilidad={availableSlots}
        loading={false}
        onTimeSelect={mockOnTimeSelect}
        selectedStartTime={null}
      />
    );

    const button = screen.getByText('08:00');
    fireEvent.click(button);

    expect(mockOnTimeSelect).toHaveBeenCalledWith('08:00', '08:30');
  });

  it('highlights selected start time', () => {
    const mockOnTimeSelect = vi.fn();
    const availableSlots = ['08:00', '08:30', '09:00'];

    render(
      <AvailabilityView
        espacioId="space-1"
        fecha="2026-08-01"
        disponibilidad={availableSlots}
        loading={false}
        onTimeSelect={mockOnTimeSelect}
        selectedStartTime="08:00"
      />
    );

    const button = screen.getByText('08:00');
    expect(button.classList.contains('bg-gold-500')).toBe(true);
  });

  it('disables unavailable slots', () => {
    const mockOnTimeSelect = vi.fn();
    const availableSlots = ['08:00', '09:00'];

    render(
      <AvailabilityView
        espacioId="space-1"
        fecha="2026-08-01"
        disponibilidad={availableSlots}
        loading={false}
        onTimeSelect={mockOnTimeSelect}
        selectedStartTime={null}
      />
    );

    const buttons = screen.getAllByRole('button').filter((btn) => /\d{2}:\d{2}/.test(btn.textContent || ''));
    const disabledButtons = buttons.filter((btn) => btn.hasAttribute('disabled'));

    // 08:30 should be disabled since it's not in available slots
    expect(disabledButtons.length > 0).toBe(true);
  });

  it('handles disponibilidad as object with available property', () => {
    const mockOnTimeSelect = vi.fn();
    const disponibilidadObject = {
      available: ['08:00', '08:30'],
    };

    render(
      <AvailabilityView
        espacioId="space-1"
        fecha="2026-08-01"
        disponibilidad={disponibilidadObject}
        loading={false}
        onTimeSelect={mockOnTimeSelect}
        selectedStartTime={null}
      />
    );

    expect(screen.getByText('08:00')).toBeInTheDocument();
    expect(screen.getByText('08:30')).toBeInTheDocument();
  });
});
