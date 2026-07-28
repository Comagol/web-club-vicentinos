import { render, screen } from '@testing-library/react';
import { ReservasPage } from './ReservasPage';
import * as hooksModule from '../../hooks/useReservations';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the portal layout to simplify rendering
vi.mock('../../components/portal/PortalLayout', () => ({
  PortalLayout: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('../../hooks/useRequireAuth', () => ({
  useRequireAuth: () => ({ isLoading: false }),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

const mockEspacios = [
  { id: '1', nombre: 'Salón A', capacidad: 50, descripcion: 'Salón principal', activo: true },
];

describe('ReservasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title and subtitle', () => {
    vi.spyOn(hooksModule, 'useReservations').mockReturnValue({
      espacios: mockEspacios,
      disponibilidad: null,
      loading: false,
      error: null,
      getEspacios: vi.fn(),
      getDisponibilidad: vi.fn(),
      crearReserva: vi.fn(),
      clearError: vi.fn(),
    });

    render(<ReservasPage />);
    expect(screen.getByText('Reservar Espacios')).toBeInTheDocument();
    expect(screen.getByText(/Reserva nuestros espacios/)).toBeInTheDocument();
  });

  it('displays error banner when hook returns error', () => {
    vi.spyOn(hooksModule, 'useReservations').mockReturnValue({
      espacios: [],
      disponibilidad: null,
      loading: false,
      error: 'Failed to load spaces',
      getEspacios: vi.fn(),
      getDisponibilidad: vi.fn(),
      crearReserva: vi.fn(),
      clearError: vi.fn(),
    });

    render(<ReservasPage />);
    expect(screen.getByText('Error al cargar datos')).toBeInTheDocument();
  });

  it('renders form heading', () => {
    vi.spyOn(hooksModule, 'useReservations').mockReturnValue({
      espacios: mockEspacios,
      disponibilidad: null,
      loading: false,
      error: null,
      getEspacios: vi.fn(),
      getDisponibilidad: vi.fn(),
      crearReserva: vi.fn(),
      clearError: vi.fn(),
    });

    render(<ReservasPage />);
    expect(screen.getByRole('heading', { name: /Detalles de la Reserva/ })).toBeInTheDocument();
  });

  it('shows space selection', () => {
    vi.spyOn(hooksModule, 'useReservations').mockReturnValue({
      espacios: mockEspacios,
      disponibilidad: null,
      loading: false,
      error: null,
      getEspacios: vi.fn(),
      getDisponibilidad: vi.fn(),
      crearReserva: vi.fn(),
      clearError: vi.fn(),
    });

    render(<ReservasPage />);
    const elementos = screen.getAllByText(/Salón A/);
    expect(elementos.length > 0).toBe(true);
  });
});
