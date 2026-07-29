import { renderHook, waitFor } from '@testing-library/react';
import { useTeamMembers } from './useTeamMembers';
import * as api from '../services/api';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/api');

describe('useTeamMembers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches team members on mount', async () => {
    const mockMembers = [
      {
        id: 'employee-1',
        email: 'juan@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        numeroSocio: 'SOC001',
        categoria: 'adulto' as const,
        disciplina: 'rugby' as const,
        estadoCuota: 'al_dia' as const,
        estadoMembresia: 'activo' as const,
        habilitadoEstacionamiento: true,
        rol: 'empleado' as const,
        fechaCreacion: '2026-01-01',
      },
    ];

    vi.spyOn(api.adminService, 'getUsuarios').mockResolvedValueOnce({
      data: { data: mockMembers },
    } as any);

    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.members.length).toBe(1);
    });

    expect(result.current.members[0].nombre).toBe('Juan');
  });

  it('handles errors gracefully', async () => {
    const error = new Error('API Error');
    vi.spyOn(api.adminService, 'getUsuarios').mockRejectedValueOnce(error);

    const { result } = renderHook(() => useTeamMembers());

    await waitFor(() => {
      expect(result.current.error).toBe('API Error');
    });

    expect(result.current.members).toEqual([]);
  });
});
