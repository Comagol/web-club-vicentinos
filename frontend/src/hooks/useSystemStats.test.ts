import { renderHook } from '@testing-library/react';
import { useSystemStats } from './useSystemStats';
import { Socio } from '../types/models';
import { describe, it, expect } from 'vitest';

describe('useSystemStats', () => {
  const buildUser = (overrides: Partial<Socio>): Socio => ({
    id: overrides.id || '1',
    email: 'user@vicentinos.com',
    nombre: 'Nombre',
    apellido: 'Apellido',
    numeroSocio: '001',
    categoria: 'adulto',
    disciplina: 'rugby',
    estadoCuota: 'al_dia',
    estadoMembresia: 'activo',
    habilitadoEstacionamiento: false,
    rol: 'socio',
    fechaCreacion: '2026-01-01T00:00:00Z',
    ...overrides,
  });

  it('returns all-zero stats for an empty list', () => {
    const { result } = renderHook(() => useSystemStats([], false));
    expect(result.current.stats).toEqual({
      totalUsuarios: 0,
      activos: 0,
      suspendidos: 0,
      inactivos: 0,
      empleados: 0,
      admins: 0,
      socios: 0,
      cuotaVencida: 0,
    });
  });

  it('computes counts by role, membership status and cuota', () => {
    const users: Socio[] = [
      buildUser({ id: '1', rol: 'socio', estadoMembresia: 'activo', estadoCuota: 'al_dia' }),
      buildUser({ id: '2', rol: 'empleado', estadoMembresia: 'suspendido', estadoCuota: 'vencida' }),
      buildUser({ id: '3', rol: 'admin', estadoMembresia: 'inactivo', estadoCuota: 'vencida_hace_meses' }),
      buildUser({ id: '4', rol: 'socio', estadoMembresia: 'activo', estadoCuota: 'al_dia' }),
    ];

    const { result } = renderHook(() => useSystemStats(users, false));

    expect(result.current.stats).toEqual({
      totalUsuarios: 4,
      activos: 2,
      suspendidos: 1,
      inactivos: 1,
      empleados: 1,
      admins: 1,
      socios: 2,
      cuotaVencida: 2,
    });
  });

  it('passes through the loading flag', () => {
    const { result } = renderHook(() => useSystemStats([], true));
    expect(result.current.isLoading).toBe(true);
  });
});
