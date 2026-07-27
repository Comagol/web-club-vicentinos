import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { socioService } from '../services/api';
import { Socio } from '../types/models';

export interface UseMemberProfileReturn {
  profile: Socio | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  updateProfile: (updates: Partial<Socio>) => Promise<void>;
  refetch: () => Promise<void>;
}

interface CacheData {
  data: Socio | null;
  timestamp: number;
}

export const useMemberProfile = (ttlMs: number = 5 * 60 * 1000): UseMemberProfileReturn => {
  const { usuario } = useAuth();
  const [profile, setProfile] = useState<Socio | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
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

  const fetchProfile = useCallback(async () => {
    if (!usuario?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await socioService.getProfile(usuario.id);
      const profileData = response.data.data;

      // Update cache
      cacheRef.current = {
        data: profileData,
        timestamp: Date.now(),
      };

      setProfile(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [usuario?.id]);

  const updateProfile = useCallback(async (updates: Partial<Socio>) => {
    if (!usuario?.id || !profile) return;

    setUpdating(true);
    setError(null);

    // Optimistic update: update local state immediately
    const previousProfile = profile;
    const optimisticProfile = { ...profile, ...updates };
    setProfile(optimisticProfile);

    try {
      const response = await socioService.updateProfile(usuario.id, updates);
      const updatedProfile = response.data.data;

      // Update cache with server response
      cacheRef.current = {
        data: updatedProfile,
        timestamp: Date.now(),
      };

      setProfile(updatedProfile);
    } catch (err) {
      // Rollback optimistic update on error
      setProfile(previousProfile);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      throw err; // Re-throw so component can handle if needed
    } finally {
      setUpdating(false);
    }
  }, [usuario?.id, profile]);

  const refetch = useCallback(async () => {
    // Clear cache to force refetch
    cacheRef.current = {
      data: null,
      timestamp: 0,
    };
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!usuario?.id) {
      setProfile(null);
      setError(null);
      return;
    }

    // Return cached data if valid
    if (isCacheValid()) {
      setProfile(cacheRef.current.data);
      return;
    }

    // Fetch new data
    fetchProfile();
  }, [usuario?.id, isCacheValid, fetchProfile]);

  return { profile, loading, updating, error, updateProfile, refetch };
};
