import { useMemo } from 'react';
import { Socio } from '../types/models';

export interface SystemStats {
  totalUsuarios: number;
  activos: number;
  suspendidos: number;
  inactivos: number;
  empleados: number;
  admins: number;
  socios: number;
  cuotaVencida: number;
}

/**
 * Computes system-wide statistics from the current users list.
 * There is no dedicated /admin/stats endpoint, so stats are derived
 * client-side from the same data already fetched by useAdminUsers,
 * mirroring the pattern used by useManagerTasks.
 */
export const useSystemStats = (users: Socio[], isLoading: boolean) => {
  const stats = useMemo<SystemStats>(() => {
    return {
      totalUsuarios: users.length,
      activos: users.filter((u) => u.estadoMembresia === 'activo').length,
      suspendidos: users.filter((u) => u.estadoMembresia === 'suspendido').length,
      inactivos: users.filter((u) => u.estadoMembresia === 'inactivo').length,
      empleados: users.filter((u) => u.rol === 'empleado').length,
      admins: users.filter((u) => u.rol === 'admin').length,
      socios: users.filter((u) => u.rol === 'socio').length,
      cuotaVencida: users.filter(
        (u) => u.estadoCuota === 'vencida' || u.estadoCuota === 'vencida_hace_meses',
      ).length,
    };
  }, [users]);

  return { stats, isLoading };
};
