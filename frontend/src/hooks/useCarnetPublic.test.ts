import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useCarnetPublic } from './useCarnetPublic';
import { carnetService } from '../services/api';

// Mock the carnetService
vi.mock('../services/api', () => ({
  carnetService: {
    getCarnetPublic: vi.fn(),
  },
}));

describe('useCarnetPublic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null data and no loading', () => {
    const { result } = renderHook(() => useCarnetPublic(undefined));

    expect(result.current.data).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.isValid).toBe(false);
  });

  it('should fetch carnet data when carnetId is provided', async () => {
    const mockCarnet = {
      id: 'carnet-123',
      socioId: 'socio-456',
      numeroSocio: 'S00123',
      qrCode: 'data:image/png;base64,abc123',
      estado: 'habilitado' as const,
      fotoPerfil: 'https://example.com/photo.jpg',
      fechaVencimiento: '2025-12-31',
    };

    vi.mocked(carnetService.getCarnetPublic).mockResolvedValue({
      data: { data: mockCarnet },
    } as any);

    const { result } = renderHook(() => useCarnetPublic('carnet-123'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockCarnet);
    expect(result.current.error).toBeNull();
    expect(result.current.isValid).toBe(true);
  });

  it('should handle 404 error for non-existent carnet', async () => {
    const error = new Error('Not found');
    Object.defineProperty(error, 'message', {
      value: '404: Carnet not found',
      writable: true,
    });

    vi.mocked(carnetService.getCarnetPublic).mockRejectedValue(error);

    const { result } = renderHook(() => useCarnetPublic('invalid-id'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Carnet no encontrado');
    expect(result.current.isValid).toBe(false);
  });

  it('should set isValid to false for inhabilitado status', async () => {
    const mockCarnet = {
      id: 'carnet-123',
      socioId: 'socio-456',
      numeroSocio: 'S00123',
      qrCode: 'data:image/png;base64,abc123',
      estado: 'inhabilitado' as const,
      fotoPerfil: 'https://example.com/photo.jpg',
      fechaVencimiento: '2025-12-31',
    };

    vi.mocked(carnetService.getCarnetPublic).mockResolvedValue({
      data: { data: mockCarnet },
    } as any);

    const { result } = renderHook(() => useCarnetPublic('carnet-123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockCarnet);
    expect(result.current.isValid).toBe(false);
  });

  it('should refetch data when refetch is called', async () => {
    const mockCarnet = {
      id: 'carnet-123',
      socioId: 'socio-456',
      numeroSocio: 'S00123',
      qrCode: 'data:image/png;base64,abc123',
      estado: 'habilitado' as const,
      fotoPerfil: 'https://example.com/photo.jpg',
      fechaVencimiento: '2025-12-31',
    };

    vi.mocked(carnetService.getCarnetPublic).mockResolvedValue({
      data: { data: mockCarnet },
    } as any);

    const { result } = renderHook(() => useCarnetPublic('carnet-123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(vi.mocked(carnetService.getCarnetPublic)).toHaveBeenCalledTimes(1);

    // Call refetch
    await result.current.refetch();

    expect(vi.mocked(carnetService.getCarnetPublic)).toHaveBeenCalledTimes(2);
  });

  it('should not fetch when carnetId is undefined', () => {
    renderHook(() => useCarnetPublic(undefined));

    expect(vi.mocked(carnetService.getCarnetPublic)).not.toHaveBeenCalled();
  });

  it('should handle generic API errors', async () => {
    vi.mocked(carnetService.getCarnetPublic).mockRejectedValue(
      new Error('Server error')
    );

    const { result } = renderHook(() => useCarnetPublic('carnet-123'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Server error');
  });
});
