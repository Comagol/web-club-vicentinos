import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/api';
import { Socio } from '../types/models';
import { useAuth } from './useAuth';

export interface UserFilters {
  rol?: Socio['rol'] | 'all';
  estadoMembresia?: Socio['estadoMembresia'] | 'all';
  busqueda?: string;
}

export interface ActivityEntry {
  id: string;
  accion: 'creado' | 'actualizado' | 'eliminado';
  usuarioNombre: string;
  adminEmail: string;
  timestamp: string;
}

const MAX_ACTIVITY_ENTRIES = 20;

export const useAdminUsers = (filters?: UserFilters) => {
  const { usuario } = useAuth();
  const [users, setUsers] = useState<Socio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);

  const logActivity = useCallback(
    (accion: ActivityEntry['accion'], usuarioNombre: string) => {
      setActivityLog((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          accion,
          usuarioNombre,
          adminEmail: usuario?.email || 'admin',
          timestamp: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, MAX_ACTIVITY_ENTRIES));
    },
    [usuario],
  );

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiFilters: Record<string, string> = {};
      if (filters?.rol && filters.rol !== 'all') apiFilters.rol = filters.rol;
      if (filters?.estadoMembresia && filters.estadoMembresia !== 'all') {
        apiFilters.estadoMembresia = filters.estadoMembresia;
      }
      if (filters?.busqueda) apiFilters.busqueda = filters.busqueda;

      const response = await adminService.getUsuarios(apiFilters);
      const responseData = response.data?.data || response.data;
      const socios = Array.isArray(responseData)
        ? responseData
        : (responseData as any)?.items || [];

      setUsers(socios);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar usuarios';
      setError(errorMsg);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.rol, filters?.estadoMembresia, filters?.busqueda]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(
    async (data: Omit<Socio, 'id' | 'fechaCreacion'>) => {
      setError(null);
      try {
        const response = await adminService.crearUsuario(data);
        const newUser = (response.data?.data || response.data) as Socio;
        setUsers((prev) => [newUser, ...prev]);
        logActivity('creado', `${newUser.nombre} ${newUser.apellido}`);
        return newUser;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al crear usuario';
        setError(errorMsg);
        throw err;
      }
    },
    [logActivity],
  );

  const updateUser = useCallback(
    async (userId: string, data: Partial<Socio>) => {
      setError(null);
      try {
        const response = await adminService.actualizarUsuario(userId, data);
        const updated = (response.data?.data || response.data) as Socio;
        setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
        logActivity('actualizado', `${updated.nombre} ${updated.apellido}`);
        return updated;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al actualizar usuario';
        setError(errorMsg);
        throw err;
      }
    },
    [logActivity],
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      setError(null);
      const target = users.find((u) => u.id === userId);
      try {
        await adminService.eliminarUsuario(userId);
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        logActivity('eliminado', target ? `${target.nombre} ${target.apellido}` : userId);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Error al eliminar usuario';
        setError(errorMsg);
        throw err;
      }
    },
    [users, logActivity],
  );

  const refresh = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

  const clearError = useCallback(() => setError(null), []);

  return {
    users,
    isLoading,
    error,
    activityLog,
    createUser,
    updateUser,
    deleteUser,
    refresh,
    clearError,
  };
};
