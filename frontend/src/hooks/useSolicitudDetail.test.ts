import { renderHook, waitFor } from '@testing-library/react';
import { useSolicitudDetail } from './useSolicitudDetail';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Solicitud } from '../types/models';

vi.mock('../services/api');

const baseSolicitud: Solicitud = {
  id: 'sol-1',
  tipo: 'reserva',
  estado: 'pendiente',
  detalle: { espacio: 'Cancha 1' },
  solicitanteName: 'Juan Perez',
  fechaCreacion: '2026-07-01T00:00:00Z',
};

describe('useSolicitudDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with the provided solicitud', () => {
    const { result } = renderHook(() => useSolicitudDetail(baseSolicitud));
    expect(result.current.solicitud).toEqual(baseSolicitud);
  });

  it('approves a solicitud', async () => {
    const approved = { ...baseSolicitud, estado: 'aprobado' as const };
    vi.spyOn(api.solicitudService, 'aprobarSolicitud').mockResolvedValueOnce({
      data: { data: approved },
    } as any);

    const { result } = renderHook(() => useSolicitudDetail(baseSolicitud));

    await result.current.aprobar('ok');

    await waitFor(() => {
      expect(result.current.solicitud?.estado).toBe('aprobado');
    });
    expect(api.solicitudService.aprobarSolicitud).toHaveBeenCalledWith('sol-1', 'ok');
  });

  it('rejects a solicitud with a note', async () => {
    const rejected = { ...baseSolicitud, estado: 'rechazado' as const, notaRechazo: 'no disponible' };
    vi.spyOn(api.solicitudService, 'rechazarSolicitud').mockResolvedValueOnce({
      data: { data: rejected },
    } as any);

    const { result } = renderHook(() => useSolicitudDetail(baseSolicitud));

    await result.current.rechazar('no disponible');

    await waitFor(() => {
      expect(result.current.solicitud?.estado).toBe('rechazado');
    });
    expect(api.solicitudService.rechazarSolicitud).toHaveBeenCalledWith('sol-1', 'no disponible');
  });

  it('throws and sets error when rejecting without a note', async () => {
    const { result } = renderHook(() => useSolicitudDetail(baseSolicitud));

    await expect(result.current.rechazar('')).rejects.toThrow();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });
    expect(api.solicitudService.rechazarSolicitud).not.toHaveBeenCalled();
  });

  it('handles API errors on approve', async () => {
    vi.spyOn(api.solicitudService, 'aprobarSolicitud').mockRejectedValueOnce(
      new Error('Server error'),
    );

    const { result } = renderHook(() => useSolicitudDetail(baseSolicitud));

    await expect(result.current.aprobar()).rejects.toThrow('Server error');

    await waitFor(() => {
      expect(result.current.error).toBe('Server error');
    });
  });
});
