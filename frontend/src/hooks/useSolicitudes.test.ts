import { renderHook, waitFor } from '@testing-library/react';
import { useSolicitudes } from './useSolicitudes';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');

const today = new Date().toISOString();

describe('useSolicitudes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches solicitudes on mount and sorts by date desc', async () => {
    const mockSolicitudes = [
      {
        id: 'sol-1',
        tipo: 'reserva' as const,
        estado: 'pendiente' as const,
        detalle: {},
        solicitanteName: 'Juan Perez',
        fechaCreacion: '2026-07-01T00:00:00Z',
      },
      {
        id: 'sol-2',
        tipo: 'actividad' as const,
        estado: 'aprobado' as const,
        detalle: {},
        solicitanteName: 'Ana Gomez',
        fechaCreacion: today,
      },
    ];

    vi.spyOn(api.solicitudService, 'getSolicitudes').mockResolvedValueOnce({
      data: { data: mockSolicitudes },
    } as any);

    const { result } = renderHook(() => useSolicitudes());

    await waitFor(() => {
      expect(result.current.solicitudes).toHaveLength(2);
    });

    // Newest first
    expect(result.current.solicitudes[0].id).toBe('sol-2');
    expect(result.current.stats.total).toBe(2);
    expect(result.current.stats.pendientes).toBe(1);
    expect(result.current.stats.aprobadasHoy).toBe(1);
    expect(result.current.stats.rechazadasHoy).toBe(0);
  });

  it('handles errors gracefully', async () => {
    const error = new Error('API Error');
    vi.spyOn(api.solicitudService, 'getSolicitudes').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSolicitudes());

    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
    });

    expect(result.current.solicitudes).toEqual([]);
  });

  it('passes filters to the API call', async () => {
    vi.spyOn(api.solicitudService, 'getSolicitudes').mockResolvedValueOnce({
      data: { data: [] },
    } as any);

    renderHook(() => useSolicitudes({ tipo: 'reserva', estado: 'pendiente' }));

    await waitFor(() => {
      expect(api.solicitudService.getSolicitudes).toHaveBeenCalledWith({
        tipo: 'reserva',
        estado: 'pendiente',
      });
    });
  });
});
