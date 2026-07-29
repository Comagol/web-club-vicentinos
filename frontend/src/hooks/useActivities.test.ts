import { renderHook, waitFor } from '@testing-library/react';
import { useActivities } from './useActivities';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');
vi.mock('./useAuth', () => ({
  useAuth: () => ({
    usuario: { id: 'user-123' },
    isAuthenticated: true,
  }),
}));

describe('useActivities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches actividades on mount', async () => {
    const mockActividades = [
      {
        id: '1',
        nombre: 'Actividad A',
        descripcion: 'Descripción',
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-05',
        cuota: 100,
        estado: 'abierta' as const,
        limitePlazas: 50,
        inscriptosCount: 10,
      },
    ];

    vi.spyOn(api.actividadService, 'getActividades').mockResolvedValueOnce({
      data: { data: mockActividades },
    } as any);

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.actividades).toEqual(mockActividades);
    });
  });

  it('handles paginated response', async () => {
    const mockActividades = [
      {
        id: '1',
        nombre: 'Actividad A',
        descripcion: 'Descripción',
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-05',
        cuota: 100,
        estado: 'abierta' as const,
        limitePlazas: 50,
        inscriptosCount: 10,
      },
    ];

    vi.spyOn(api.actividadService, 'getActividades').mockResolvedValueOnce({
      data: {
        data: {
          data: mockActividades,
          total: 1,
          page: 1,
        },
      },
    } as any);

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.actividades).toEqual(mockActividades);
    });
  });

  it('handles error when fetching actividades', async () => {
    vi.spyOn(api.actividadService, 'getActividades').mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.actividades).toEqual([]);
    });
  });

  it('clears error on clearError call', async () => {
    vi.spyOn(api.actividadService, 'getActividades').mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useActivities());

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    await result.current.clearError();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
    });
  });
});
