import { renderHook, waitFor } from '@testing-library/react';
import { useSubcomisionEspacios } from './useSubcomisionEspacios';
import * as hooksModule from './useAuth';
import { reservaService } from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./useAuth');
vi.mock('../services/api');

describe('useSubcomisionEspacios', () => {
  const mockEspacios = [
    { id: '1', nombre: 'Salón A', capacidad: 50, descripcion: 'Salón grande', activo: true },
    { id: '2', nombre: 'Salón B', capacidad: 30, descripcion: 'Salón pequeño', activo: false },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    vi.spyOn(hooksModule, 'useAuth').mockReturnValue({
      usuario: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      restoreSession: vi.fn(),
      requestPasswordReset: vi.fn(),
      resetPassword: vi.fn(),
    });

    const { result } = renderHook(() => useSubcomisionEspacios());
    expect(result.current.espacios).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should fetch espacios when authorized user is present', async () => {
    vi.spyOn(hooksModule, 'useAuth').mockReturnValue({
      usuario: { id: '1', email: 'test@test.com', roles: ['subcomision'] },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      restoreSession: vi.fn(),
      requestPasswordReset: vi.fn(),
      resetPassword: vi.fn(),
    });

    vi.spyOn(reservaService, 'getEspacios').mockResolvedValue({
      data: { data: mockEspacios },
    } as any);

    const { result } = renderHook(() => useSubcomisionEspacios());

    await waitFor(() => {
      expect(result.current.espacios).toEqual(mockEspacios);
    });
  });

  it('should clear error', async () => {
    vi.spyOn(hooksModule, 'useAuth').mockReturnValue({
      usuario: { id: '1', email: 'test@test.com', roles: ['subcomision'] },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      restoreSession: vi.fn(),
      requestPasswordReset: vi.fn(),
      resetPassword: vi.fn(),
    });

    const { result } = renderHook(() => useSubcomisionEspacios());
    result.current.clearError();
    expect(result.current.error).toBeNull();
  });
});
