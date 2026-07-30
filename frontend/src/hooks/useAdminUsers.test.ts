import { renderHook, waitFor, act } from '@testing-library/react';
import { useAdminUsers } from './useAdminUsers';
import * as hooksModule from './useAuth';
import { adminService } from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./useAuth');
vi.mock('../services/api');

describe('useAdminUsers', () => {
  const mockUsers = [
    {
      id: '1',
      email: 'juan@vicentinos.com',
      nombre: 'Juan',
      apellido: 'Perez',
      numeroSocio: '001',
      categoria: 'adulto' as const,
      disciplina: 'rugby' as const,
      estadoCuota: 'al_dia' as const,
      estadoMembresia: 'activo' as const,
      habilitadoEstacionamiento: false,
      rol: 'socio' as const,
      fechaCreacion: '2026-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'ana@vicentinos.com',
      nombre: 'Ana',
      apellido: 'Gomez',
      numeroSocio: '002',
      categoria: 'joven' as const,
      disciplina: 'hockey' as const,
      estadoCuota: 'vencida' as const,
      estadoMembresia: 'suspendido' as const,
      habilitadoEstacionamiento: true,
      rol: 'empleado' as const,
      fechaCreacion: '2026-02-01T00:00:00Z',
    },
  ];

  const mockAuthReturn = {
    usuario: { id: 'admin1', email: 'admin@vicentinos.com', roles: ['admin'] },
    isAuthenticated: true,
    isLoading: false,
    error: null,
    login: vi.fn(),
    logout: vi.fn(),
    restoreSession: vi.fn(),
    requestPasswordReset: vi.fn(),
    resetPassword: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(hooksModule, 'useAuth').mockReturnValue(mockAuthReturn);
  });

  it('should initialize with empty state and fetch users', async () => {
    vi.spyOn(adminService, 'getUsuarios').mockResolvedValue({
      data: { data: mockUsers },
    } as any);

    const { result } = renderHook(() => useAdminUsers());

    await waitFor(() => {
      expect(result.current.users).toEqual(mockUsers);
    });
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.spyOn(adminService, 'getUsuarios').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useAdminUsers());

    await waitFor(() => {
      expect(result.current.error).toBe('Network error');
    });
    expect(result.current.users).toEqual([]);
  });

  it('should create a user and log activity', async () => {
    vi.spyOn(adminService, 'getUsuarios').mockResolvedValue({ data: { data: [] } } as any);
    const newUser = { ...mockUsers[0], id: '3' };
    vi.spyOn(adminService, 'crearUsuario').mockResolvedValue({
      data: { data: newUser },
    } as any);

    const { result } = renderHook(() => useAdminUsers());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.createUser(newUser as any);
    });

    expect(result.current.users).toContainEqual(newUser);
    expect(result.current.activityLog[0]).toMatchObject({
      accion: 'creado',
      usuarioNombre: 'Juan Perez',
      adminEmail: 'admin@vicentinos.com',
    });
  });

  it('should update a user and log activity', async () => {
    vi.spyOn(adminService, 'getUsuarios').mockResolvedValue({
      data: { data: mockUsers },
    } as any);
    const updatedUser = { ...mockUsers[0], nombre: 'Juanito' };
    vi.spyOn(adminService, 'actualizarUsuario').mockResolvedValue({
      data: { data: updatedUser },
    } as any);

    const { result } = renderHook(() => useAdminUsers());

    await waitFor(() => expect(result.current.users).toEqual(mockUsers));

    await act(async () => {
      await result.current.updateUser('1', { nombre: 'Juanito' });
    });

    expect(result.current.users.find((u) => u.id === '1')?.nombre).toBe('Juanito');
    expect(result.current.activityLog[0].accion).toBe('actualizado');
  });

  it('should delete a user and log activity', async () => {
    vi.spyOn(adminService, 'getUsuarios').mockResolvedValue({
      data: { data: mockUsers },
    } as any);
    vi.spyOn(adminService, 'eliminarUsuario').mockResolvedValue({
      data: { data: null },
    } as any);

    const { result } = renderHook(() => useAdminUsers());

    await waitFor(() => expect(result.current.users).toEqual(mockUsers));

    await act(async () => {
      await result.current.deleteUser('1');
    });

    expect(result.current.users.find((u) => u.id === '1')).toBeUndefined();
    expect(result.current.activityLog[0]).toMatchObject({
      accion: 'eliminado',
      usuarioNombre: 'Juan Perez',
    });
  });

  it('should clear error', async () => {
    vi.spyOn(adminService, 'getUsuarios').mockResolvedValue({ data: { data: [] } } as any);
    const { result } = renderHook(() => useAdminUsers());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});
