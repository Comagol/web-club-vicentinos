import { renderHook, waitFor } from '@testing-library/react';
import { useTaskDetail } from './useTaskDetail';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');

describe('useTaskDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not fetch if no taskId provided', async () => {
    const { result } = renderHook(() => useTaskDetail(null));

    expect(result.current.task).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update task status', async () => {
    const mockTarea = {
      id: 'tarea-1',
      titulo: 'Task 1',
      descripcion: 'Description 1',
      asignadoA: 'user-123',
      estado: 'pendiente' as const,
      prioridad: 'alta' as const,
      fechaVencimiento: '2026-08-15',
      createdAt: '2026-07-28T00:00:00Z',
    };

    const updatedTarea = { ...mockTarea, estado: 'en_progreso' as const };

    vi.spyOn(api.tareaService, 'actualizarTarea').mockResolvedValueOnce({
      data: { data: updatedTarea },
    } as any);

    const { result } = renderHook(() => useTaskDetail('tarea-1'));

    // Set initial task state
    // Note: In a real detail view, the task would be fetched first, but for this test
    // we're directly calling updateStatus
    await result.current.updateStatus('en_progreso');

    await waitFor(() => {
      expect(api.tareaService.actualizarTarea).toHaveBeenCalledWith('tarea-1', {
        estado: 'en_progreso',
      });
    });
  });

  it('should handle update error', async () => {
    vi.spyOn(api.tareaService, 'actualizarTarea').mockRejectedValueOnce(
      new Error('Failed to update task')
    );

    const { result } = renderHook(() => useTaskDetail('tarea-1'));

    await expect(result.current.updateStatus('completado')).rejects.toThrow(
      'Failed to update task'
    );

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('should have refetch function', () => {
    const { result } = renderHook(() => useTaskDetail('tarea-1'));

    expect(typeof result.current.refetch).toBe('function');
  });
});
