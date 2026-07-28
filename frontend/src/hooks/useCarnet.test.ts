import { renderHook } from '@testing-library/react';
import { useCarnet } from './useCarnet';
import { useAuth } from './useAuth';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('./useAuth');

describe('useCarnet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state when no user', () => {
    const mockUseAuth = useAuth as any;
    mockUseAuth.mockReturnValue({
      usuario: null,
      isAuthenticated: false,
      isLoading: false,
    });

    const { result } = renderHook(() => useCarnet());

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('has refetch function', () => {
    const mockUseAuth = useAuth as any;
    mockUseAuth.mockReturnValue({
      usuario: null,
      isAuthenticated: false,
      isLoading: false,
    });

    const { result } = renderHook(() => useCarnet());

    expect(typeof result.current.refetch).toBe('function');
  });
});
