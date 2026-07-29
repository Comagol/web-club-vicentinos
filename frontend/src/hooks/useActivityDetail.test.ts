import { renderHook, waitFor } from '@testing-library/react';
import { useActivityDetail } from './useActivityDetail';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');
vi.mock('./useAuth', () => ({
  useAuth: () => ({
    usuario: { id: 'user-123' },
    isAuthenticated: true,
  }),
}));

describe('useActivityDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches activity detail', async () => {
    const mockActividad = {
      id: '1',
      nombre: 'Actividad A',
      descripcion: 'Descripción',
      fechaInicio: '2026-08-01',
      fechaFin: '2026-08-05',
      cuota: 100,
      estado: 'abierta' as const,
      limitePlazas: 50,
      inscriptosCount: 10,
    };

    vi.spyOn(api.actividadService, 'getActividad').mockResolvedValueOnce({
      data: { data: mockActividad },
    } as any);

    const { result } = renderHook(() => useActivityDetail());

    await result.current.fetchActivityDetail('1');

    await waitFor(() => {
      expect(result.current.actividad).toEqual(mockActividad);
    });
  });

  it('enrolls in activity', async () => {
    const mockActividad = {
      id: '1',
      nombre: 'Actividad A',
      descripcion: 'Descripción',
      fechaInicio: '2026-08-01',
      fechaFin: '2026-08-05',
      cuota: 100,
      estado: 'abierta' as const,
      limitePlazas: 50,
      inscriptosCount: 11,
    };

    vi.spyOn(api.actividadService, 'inscribirse').mockResolvedValueOnce({
      data: { data: {} },
    } as any);

    vi.spyOn(api.actividadService, 'getActividad').mockResolvedValueOnce({
      data: { data: mockActividad },
    } as any);

    const { result } = renderHook(() => useActivityDetail());

    await result.current.enrollInActivity('1');

    await waitFor(() => {
      expect(result.current.actividad?.inscriptosCount).toBe(11);
      expect(api.actividadService.inscribirse).toHaveBeenCalledWith(
        'user-123',
        '1'
      );
    });
  });

  it('handles error when enrolling', async () => {
    vi.spyOn(api.actividadService, 'inscribirse').mockRejectedValueOnce(
      new Error('Already enrolled')
    );

    const { result } = renderHook(() => useActivityDetail());

    await expect(result.current.enrollInActivity('1')).rejects.toThrow(
      'Already enrolled'
    );

    await waitFor(() => {
      expect(result.current.enrollmentError).toBeDefined();
    });
  });

  it('clears errors', async () => {
    vi.spyOn(api.actividadService, 'getActividad').mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useActivityDetail());

    await result.current.fetchActivityDetail('1');

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    result.current.clearErrors();

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.enrollmentError).toBeNull();
    });
  });
});
