import { renderHook, waitFor } from '@testing-library/react';
import { useManagerTasks } from './useManagerTasks';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');

describe('useManagerTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches tasks on mount', async () => {
    const mockTasks = [
      {
        id: 'task-1',
        titulo: 'Test Task',
        descripcion: 'A test task',
        asignadoA: 'employee-1',
        estado: 'pendiente' as const,
        prioridad: 'alta' as const,
        fechaVencimiento: '2026-08-05',
        createdAt: '2026-07-28T00:00:00Z',
      },
    ];

    vi.spyOn(api.tareaService, 'getTareas').mockResolvedValueOnce({
      data: { data: mockTasks },
    } as any);

    const { result } = renderHook(() => useManagerTasks());

    await waitFor(() => {
      expect(result.current.tasks).toEqual(mockTasks);
    });

    expect(result.current.stats.total).toBe(1);
    expect(result.current.stats.pendiente).toBe(1);
  });

  it('handles errors gracefully', async () => {
    const error = new Error('API Error');
    vi.spyOn(api.tareaService, 'getTareas').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useManagerTasks());

    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
    });

    expect(result.current.tasks).toEqual([]);
  });
});
