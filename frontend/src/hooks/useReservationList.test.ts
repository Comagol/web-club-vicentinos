import { renderHook, waitFor } from '@testing-library/react';
import { useReservationList } from './useReservationList';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');
vi.mock('./useAuth', () => ({
  useAuth: () => ({
    usuario: { id: 'user-123' },
    isAuthenticated: true,
  }),
}));

describe('useReservationList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches reservations on mount', async () => {
    const mockReservas = [
      {
        id: 'reserva-1',
        socioId: 'user-123',
        espacioId: 'espacio-1',
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-01',
        horaInicio: '08:00',
        horaFin: '09:00',
        notas: 'Test reservation',
        estado: 'pendiente' as const,
        createdAt: '2026-07-28T00:00:00Z',
      },
    ];

    vi.spyOn(api.reservaService, 'getReservas').mockResolvedValueOnce({
      data: { data: mockReservas },
    } as any);

    const { result } = renderHook(() => useReservationList());

    await waitFor(() => {
      expect(result.current.reservations).toEqual(mockReservas);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles loading state', () => {
    vi.spyOn(api.reservaService, 'getReservas').mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ data: { data: [] } } as any), 100)
        )
    );

    const { result } = renderHook(() => useReservationList());

    expect(result.current.isLoading).toBe(true);
  });

  it('cancels a reservation', async () => {
    const mockReservas = [
      {
        id: 'reserva-1',
        socioId: 'user-123',
        espacioId: 'espacio-1',
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-01',
        horaInicio: '08:00',
        horaFin: '09:00',
        estado: 'pendiente' as const,
        createdAt: '2026-07-28T00:00:00Z',
      },
      {
        id: 'reserva-2',
        socioId: 'user-123',
        espacioId: 'espacio-2',
        fechaInicio: '2026-08-02',
        fechaFin: '2026-08-02',
        horaInicio: '10:00',
        horaFin: '11:00',
        estado: 'aprobado' as const,
        createdAt: '2026-07-27T00:00:00Z',
      },
    ];

    vi.spyOn(api.reservaService, 'getReservas').mockResolvedValueOnce({
      data: { data: mockReservas },
    } as any);

    vi.spyOn(api.reservaService, 'cancelarReserva').mockResolvedValueOnce({
      data: null,
    } as any);

    const { result } = renderHook(() => useReservationList());

    await waitFor(() => {
      expect(result.current.reservations).toHaveLength(2);
    });

    await result.current.cancelReservation('reserva-1');

    await waitFor(() => {
      expect(result.current.reservations).toHaveLength(1);
      expect(result.current.reservations[0].id).toBe('reserva-2');
    });
  });

  it('handles error when fetching reservations', async () => {
    vi.spyOn(api.reservaService, 'getReservas').mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useReservationList());

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.reservations).toEqual([]);
    });
  });

  it('refetches reservations', async () => {
    const mockReservas = [
      {
        id: 'reserva-1',
        socioId: 'user-123',
        espacioId: 'espacio-1',
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-01',
        horaInicio: '08:00',
        horaFin: '09:00',
        estado: 'pendiente' as const,
        createdAt: '2026-07-28T00:00:00Z',
      },
    ];

    vi.spyOn(api.reservaService, 'getReservas').mockResolvedValueOnce({
      data: { data: mockReservas },
    } as any);

    const { result } = renderHook(() => useReservationList());

    await waitFor(() => {
      expect(result.current.reservations).toEqual(mockReservas);
    });

    vi.spyOn(api.reservaService, 'getReservas').mockResolvedValueOnce({
      data: { data: [] },
    } as any);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.reservations).toEqual([]);
    });
  });
});
