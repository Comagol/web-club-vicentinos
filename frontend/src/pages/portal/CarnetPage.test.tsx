import { render, screen } from '@testing-library/react';
import { CarnetPage } from './CarnetPage';
import { useCarnet } from '../../hooks/useCarnet';
import { useMemberProfile } from '../../hooks/useMemberProfile';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { Carnet, Socio } from '../../types/models';
import { vi, describe, it, beforeEach, expect } from 'vitest';

vi.mock('../../hooks/useCarnet');
vi.mock('../../hooks/useMemberProfile');
vi.mock('../../hooks/useRequireAuth');
vi.mock('../../components/portal/PortalLayout', () => ({
  PortalLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockCarnet: Carnet = {
  id: 'carnet-123',
  socioId: 'socio-123',
  numeroSocio: '001234',
  qrCode: 'QR_DATA_HERE',
  estado: 'habilitado',
  fotoPerfil: 'https://example.com/photo.jpg',
  fechaVencimiento: '2026-12-31',
};

const mockMember: Socio = {
  id: 'socio-123',
  email: 'john@example.com',
  nombre: 'John',
  apellido: 'Doe',
  fotoPerfil: 'https://example.com/photo.jpg',
  numeroSocio: '001234',
  categoria: 'adulto',
  disciplina: 'rugby',
  estadoCuota: 'al_dia',
  estadoMembresia: 'activo',
  habilitadoEstacionamiento: true,
  rol: 'socio',
  fechaCreacion: '2024-01-01',
};

describe('CarnetPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title', () => {
    const mockUseRequireAuth = useRequireAuth as any;
    mockUseRequireAuth.mockReturnValue({ isLoading: false });

    const mockUseMemberProfile = useMemberProfile as any;
    mockUseMemberProfile.mockReturnValue({
      profile: mockMember,
      loading: false,
      updating: false,
      error: null,
      updateProfile: vi.fn(),
      refetch: vi.fn(),
    });

    const mockUseCarnet = useCarnet as any;
    mockUseCarnet.mockReturnValue({
      data: mockCarnet,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<CarnetPage />);

    expect(screen.getByText('Mi Carnet Digital')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const mockUseRequireAuth = useRequireAuth as any;
    mockUseRequireAuth.mockReturnValue({ isLoading: false });

    const mockUseMemberProfile = useMemberProfile as any;
    mockUseMemberProfile.mockReturnValue({
      profile: null,
      loading: true,
      updating: false,
      error: null,
      updateProfile: vi.fn(),
      refetch: vi.fn(),
    });

    const mockUseCarnet = useCarnet as any;
    mockUseCarnet.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<CarnetPage />);

    expect(screen.getByText('Cargando tu carnet...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    const mockUseRequireAuth = useRequireAuth as any;
    mockUseRequireAuth.mockReturnValue({ isLoading: false });

    const mockUseMemberProfile = useMemberProfile as any;
    mockUseMemberProfile.mockReturnValue({
      profile: null,
      loading: false,
      updating: false,
      error: null,
      updateProfile: vi.fn(),
      refetch: vi.fn(),
    });

    const mockUseCarnet = useCarnet as any;
    mockUseCarnet.mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to fetch carnet',
      refetch: vi.fn(),
    });

    render(<CarnetPage />);

    expect(screen.getByText('No se pudo cargar tu carnet')).toBeInTheDocument();
  });

  it('displays carnet data when loaded', () => {
    const mockUseRequireAuth = useRequireAuth as any;
    mockUseRequireAuth.mockReturnValue({ isLoading: false });

    const mockUseMemberProfile = useMemberProfile as any;
    mockUseMemberProfile.mockReturnValue({
      profile: mockMember,
      loading: false,
      updating: false,
      error: null,
      updateProfile: vi.fn(),
      refetch: vi.fn(),
    });

    const mockUseCarnet = useCarnet as any;
    mockUseCarnet.mockReturnValue({
      data: mockCarnet,
      loading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<CarnetPage />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
