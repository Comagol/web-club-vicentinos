import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { socioService } from '../services/api';
import { Socio } from '../types/models';

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export interface PortalData {
  membershipStatus: 'active' | 'suspended' | 'inactive';
  duesStatus: 'al día' | 'vencida' | 'vencida_hace_meses';
  carnetStatus: 'habilitado' | 'inhabilitado';
  recentActivity: ActivityItem[];
  profile: Partial<Socio>;
}

interface CacheData {
  data: PortalData | null;
  timestamp: number;
}

export const usePortalData = (ttlMs: number = 5 * 60 * 1000) => {
  const { usuario } = useAuth();
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheRef = useRef<CacheData>({
    data: null,
    timestamp: 0,
  });

  const isCacheValid = useCallback(() => {
    if (!cacheRef.current.data) return false;
    const now = Date.now();
    return now - cacheRef.current.timestamp < ttlMs;
  }, [ttlMs]);

  const fetchData = useCallback(async () => {
    if (!usuario?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await socioService.getProfile(usuario.id);
      const profile = response.data.data;

      // Derive portal data from profile and mock data
      const portalData: PortalData = {
        membershipStatus: profile.estadoMembresia === 'activo' ? 'active' :
                         profile.estadoMembresia === 'suspendido' ? 'suspended' : 'inactive',
        duesStatus: profile.estadoCuota as 'al día' | 'vencida' | 'vencida_hace_meses',
        carnetStatus: 'habilitado', // Mock for now
        recentActivity: [], // Mock for now
        profile,
      };

      // Update cache
      cacheRef.current = {
        data: portalData,
        timestamp: Date.now(),
      };

      setData(portalData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portal data';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [usuario?.id]);

  const refetch = useCallback(async () => {
    // Clear cache to force refetch
    cacheRef.current = {
      data: null,
      timestamp: 0,
    };
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!usuario?.id) {
      setData(null);
      setError(null);
      return;
    }

    // Return cached data if valid
    if (isCacheValid()) {
      setData(cacheRef.current.data);
      return;
    }

    // Fetch new data
    fetchData();
  }, [usuario?.id, isCacheValid, fetchData]);

  return { data, loading, error, refetch };
};
