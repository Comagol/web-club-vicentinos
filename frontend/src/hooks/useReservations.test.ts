import { renderHook, waitFor } from '@testing-library/react';
import { useReservations } from './useReservations';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');
vi.mock('./useAuth', () => ({
  useAuth: () => ({
    usuario: { id: 'user-123' },
    isAuthenticated: true,
  }),
}));

describe('useReservations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches espacios on mount', async () => {
    const mockEspacios = [
      { id: '1', nombre: 'Salón A', capacidad: 50, descripcion: 'Salón principal', activo: true },
    ];

    vi.spyOn(api.reservaService, 'getEspacios').mockResolvedValueOnce({
      data: { data: mockEspacios },
    } as any);

    const { result } = renderHook(() => useReservations());

    await waitFor(() => {
      expect(result.current.espacios).toEqual(mockEspacios);
    });
  });

  it('fetches disponibilidad', async () => {
    const mockDisponibilidad = ['08:00', '08:30', '09:00'];

    vi.spyOn(api.reservaService, 'getEspacios').mockResolvedValueOnce({
      data: { data: [] },
    } as any);

    vi.spyOn(api.reservaService, 'getDisponibilidad').mockResolvedValueOnce({
      data: { data: mockDisponibilidad },
    } as any);

    const { result } = renderHook(() => useReservations());

    await result.current.getDisponibilidad('space-1', '2026-08-01');

    await waitFor(() => {
      expect(result.current.disponibilidad).toEqual(mockDisponibilidad);
    });
  });

  it('creates a reservation', async () => {
    const mockReserva = {
      id: 'reserva-123',
      socioId: 'user-123',
      espacioId: 'space-1',
      fechaInicio: '2026-08-01',
      fechaFin: '2026-08-01',
      estado: 'pendiente' as const,
      createdAt: '2026-07-28T00:00:00Z',
    };

    vi.spyOn(api.reservaService, 'getEspacios').mockResolvedValueOnce({
      data: { data: [] },
    } as any);

    vi.spyOn(api.reservaService, 'crearReserva').mockResolvedValueOnce({
      data: { data: mockReserva },
    } as any);

    const { result } = renderHook(() => useReservations());

    const createdReserva = await result.current.crearReserva({
      espacioId: 'space-1',
      fechaInicio: '2026-08-01',
      fechaFin: '2026-08-01',
      estado: 'pendiente',
    });

    expect(createdReserva.id).toBe('reserva-123');
  });

  it('handles error when fetching espacios', async () => {
    vi.spyOn(api.reservaService, 'getEspacios').mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useReservations());

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.espacios).toEqual([]);
    });
  });

  it('clears error on clearError call', async () => {
    vi.spyOn(api.reservaService, 'getEspacios').mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useReservations());

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    await result.current.clearError();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
