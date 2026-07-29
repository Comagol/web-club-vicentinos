import { renderHook, waitFor, act } from '@testing-library/react';
import { useEmployeeTasks } from './useEmployeeTasks';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');
vi.mock('./useAuth', () => ({
  useAuth: () => ({
    usuario: { id: 'user-123' },
    isAuthenticated: true,
  }),
}));

describe('useEmployeeTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches tasks on mount', async () => {
    const mockTareas = [
      {
        id: 'tarea-1',
        titulo: 'Task 1',
        descripcion: 'Description 1',
        asignadoA: 'user-123',
        estado: 'pendiente' as const,
        prioridad: 'alta' as const,
        fechaVencimiento: '2026-08-15',
        createdAt: '2026-07-28T00:00:00Z',
      },
      {
        id: 'tarea-2',
        titulo: 'Task 2',
        descripcion: 'Description 2',
        asignadoA: 'user-123',
        estado: 'en_progreso' as const,
        prioridad: 'media' as const,
        fechaVencimiento: '2026-08-20',
        createdAt: '2026-07-27T00:00:00Z',
      },
    ];

    vi.spyOn(api.tareaService, 'getTareas').mockResolvedValueOnce({
      data: { data: mockTareas },
    } as any);

    const { result } = renderHook(() => useEmployeeTasks());

    await waitFor(() => {
      expect(result.current.tareas).toEqual(mockTareas);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(api.tareaService.getTareas).toHaveBeenCalledWith({
      asignadoA: 'user-123',
    });
  });

  it('filters tasks by estado', async () => {
    const mockTareas = [
      {
        id: 'tarea-1',
        titulo: 'Task 1',
        descripcion: 'Description 1',
        asignadoA: 'user-123',
        estado: 'pendiente' as const,
        prioridad: 'alta' as const,
        fechaVencimiento: '2026-08-15',
        createdAt: '2026-07-28T00:00:00Z',
      },
      {
        id: 'tarea-2',
        titulo: 'Task 2',
        descripcion: 'Description 2',
        asignadoA: 'user-123',
        estado: 'en_progreso' as const,
        prioridad: 'media' as const,
        fechaVencimiento: '2026-08-20',
        createdAt: '2026-07-27T00:00:00Z',
      },
      {
        id: 'tarea-3',
        titulo: 'Task 3',
        descripcion: 'Description 3',
        asignadoA: 'user-123',
        estado: 'completado' as const,
        prioridad: 'baja' as const,
        fechaVencimiento: '2026-08-10',
        createdAt: '2026-07-26T00:00:00Z',
      },
    ];

    vi.spyOn(api.tareaService, 'getTareas').mockResolvedValueOnce({
      data: { data: mockTareas },
    } as any);

    const { result } = renderHook(() => useEmployeeTasks());

    await waitFor(() => {
      expect(result.current.tareas).toEqual(mockTareas);
    });

    act(() => {
      result.current.applyFilters('pendiente');
    });

    expect(result.current.filters.estado).toBe('pendiente');
    expect(result.current.filteredTareas).toHaveLength(1);
    expect(result.current.filteredTareas[0].id).toBe('tarea-1');
  });

  it('filters tasks by prioridad', async () => {
    const mockTareas = [
      {
        id: 'tarea-1',
        titulo: 'Task 1',
        descripcion: 'Description 1',
        asignadoA: 'user-123',
        estado: 'pendiente' as const,
        prioridad: 'alta' as const,
        fechaVencimiento: '2026-08-15',
        createdAt: '2026-07-28T00:00:00Z',
      },
      {
        id: 'tarea-2',
        titulo: 'Task 2',
        descripcion: 'Description 2',
        asignadoA: 'user-123',
        estado: 'en_progreso' as const,
        prioridad: 'media' as const,
        fechaVencimiento: '2026-08-20',
        createdAt: '2026-07-27T00:00:00Z',
      },
      {
        id: 'tarea-3',
        titulo: 'Task 3',
        descripcion: 'Description 3',
        asignadoA: 'user-123',
        estado: 'completado' as const,
        prioridad: 'alta' as const,
        fechaVencimiento: '2026-08-10',
        createdAt: '2026-07-26T00:00:00Z',
      },
    ];

    vi.spyOn(api.tareaService, 'getTareas').mockResolvedValueOnce({
      data: { data: mockTareas },
    } as any);

    const { result } = renderHook(() => useEmployeeTasks());

    await waitFor(() => {
      expect(result.current.tareas).toEqual(mockTareas);
    });

    act(() => {
      result.current.applyFilters(undefined, 'alta');
    });

    expect(result.current.filters.prioridad).toBe('alta');
    expect(result.current.filteredTareas).toHaveLength(2);
    expect(result.current.filteredTareas[0].id).toBe('tarea-1');
    expect(result.current.filteredTareas[1].id).toBe('tarea-3');
  });

  it('filters tasks by both estado and prioridad', async () => {
    const mockTareas = [
      {
        id: 'tarea-1',
        titulo: 'Task 1',
        descripcion: 'Description 1',
        asignadoA: 'user-123',
        estado: 'pendiente' as const,
        prioridad: 'alta' as const,
        fechaVencimiento: '2026-08-15',
        createdAt: '2026-07-28T00:00:00Z',
      },
      {
        id: 'tarea-2',
        titulo: 'Task 2',
        descripcion: 'Description 2',
        asignadoA: 'user-123',
        estado: 'pendiente' as const,
        prioridad: 'media' as const,
        fechaVencimiento: '2026-08-20',
        createdAt: '2026-07-27T00:00:00Z',
      },
      {
        id: 'tarea-3',
        titulo: 'Task 3',
        descripcion: 'Description 3',
        asignadoA: 'user-123',
        estado: 'en_progreso' as const,
        prioridad: 'alta' as const,
        fechaVencimiento: '2026-08-10',
        createdAt: '2026-07-26T00:00:00Z',
      },
    ];

    vi.spyOn(api.tareaService, 'getTareas').mockResolvedValueOnce({
      data: { data: mockTareas },
    } as any);

    const { result } = renderHook(() => useEmployeeTasks());

    await waitFor(() => {
      expect(result.current.tareas).toEqual(mockTareas);
    });

    act(() => {
      result.current.applyFilters('pendiente', 'alta');
    });

    expect(result.current.filters.estado).toBe('pendiente');
    expect(result.current.filters.prioridad).toBe('alta');
    expect(result.current.filteredTareas).toHaveLength(1);
    expect(result.current.filteredTareas[0].id).toBe('tarea-1');
  });

  it('handles error when fetching tasks', async () => {
    vi.spyOn(api.tareaService, 'getTareas').mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() => useEmployeeTasks());

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
      expect(result.current.tareas).toEqual([]);
    });
  });

  it('refetches tasks', async () => {
    const mockTareas = [
      {
        id: 'tarea-1',
        titulo: 'Task 1',
        descripcion: 'Description 1',
        asignadoA: 'user-123',
        estado: 'pendiente' as const,
        prioridad: 'alta' as const,
        fechaVencimiento: '2026-08-15',
        createdAt: '2026-07-28T00:00:00Z',
      },
    ];

    vi.spyOn(api.tareaService, 'getTareas').mockResolvedValueOnce({
      data: { data: mockTareas },
    } as any);

    const { result } = renderHook(() => useEmployeeTasks());

    await waitFor(() => {
      expect(result.current.tareas).toEqual(mockTareas);
    });

    vi.spyOn(api.tareaService, 'getTareas').mockResolvedValueOnce({
      data: { data: [] },
    } as any);

    await result.current.refetch();

    await waitFor(() => {
      expect(result.current.tareas).toEqual([]);
    });
  });
});
