import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReservationListPage } from './ReservationListPage';
import * as hooksModule from '../../hooks/useReservationList';
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

const mockReservations = [
  {
    id: 'reserva-1',
    socioId: 'user-123',
    espacioId: 'espacio-1',
    fechaInicio: '2026-08-15',
    fechaFin: '2026-08-15',
    horaInicio: '10:00',
    horaFin: '11:00',
    notas: 'Test',
    estado: 'pendiente' as const,
    createdAt: '2026-07-28T00:00:00Z',
  },
  {
    id: 'reserva-2',
    socioId: 'user-123',
    espacioId: 'espacio-2',
    fechaInicio: '2026-08-16',
    fechaFin: '2026-08-16',
    horaInicio: '14:00',
    horaFin: '15:00',
    estado: 'aprobado' as const,
    createdAt: '2026-07-27T00:00:00Z',
  },
];

const mockEspacios = [
  { id: 'espacio-1', nombre: 'Salón Principal', capacidad: 100, descripcion: 'Main', activo: true },
  { id: 'espacio-2', nombre: 'Cancha de Hockey', capacidad: 30, descripcion: 'Hockey', activo: true },
];

describe('ReservationListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title', () => {
    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: [],
      espacios: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      cancelReservation: vi.fn(),
    });

    render(<ReservationListPage />);
    expect(screen.getByText('Mis Reservas')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: [],
      espacios: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
      cancelReservation: vi.fn(),
    });

    render(<ReservationListPage />);
    expect(screen.getByText('Cargando reservas...')).toBeInTheDocument();
  });

  it('displays empty state message', () => {
    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: [],
      espacios: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      cancelReservation: vi.fn(),
    });

    render(<ReservationListPage />);
    expect(screen.getByText('No hay reservas')).toBeInTheDocument();
    expect(screen.getByText(/No has realizado ninguna reserva aún/)).toBeInTheDocument();
  });

  it('displays error banner', () => {
    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: [],
      espacios: [],
      isLoading: false,
      error: 'Failed to load reservations',
      refetch: vi.fn(),
      cancelReservation: vi.fn(),
    });

    render(<ReservationListPage />);
    expect(screen.getByText('Error al cargar reservas')).toBeInTheDocument();
    expect(screen.getByText('Failed to load reservations')).toBeInTheDocument();
  });

  it('displays list of reservations', () => {
    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: mockReservations,
      espacios: mockEspacios,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      cancelReservation: vi.fn(),
    });

    render(<ReservationListPage />);
    const espacios = screen.getAllByText(/Salón Principal|Cancha de Hockey/);
    expect(espacios.length).toBeGreaterThan(0);
  });

  it('shows sort and filter controls when reservations exist', () => {
    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: mockReservations,
      espacios: mockEspacios,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      cancelReservation: vi.fn(),
    });

    render(<ReservationListPage />);
    const ordenarLabels = screen.getAllByText('Ordenar:');
    const estadoLabels = screen.getAllByText('Estado:');
    expect(ordenarLabels.length).toBeGreaterThan(0);
    expect(estadoLabels.length).toBeGreaterThan(0);
  });

  it('filters reservations by status', () => {
    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: mockReservations,
      espacios: mockEspacios,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      cancelReservation: vi.fn(),
    });

    render(<ReservationListPage />);

    // Get desktop filter select
    const filterSelects = screen.getAllByDisplayValue('Todos');
    const filterSelect = filterSelects[filterSelects.length - 1];

    fireEvent.change(filterSelect, { target: { value: 'pendiente' } });

    waitFor(() => {
      expect(filterSelect).toHaveValue('pendiente');
    });
  });

  it('sorts reservations by date', () => {
    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: mockReservations,
      espacios: mockEspacios,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      cancelReservation: vi.fn(),
    });

    render(<ReservationListPage />);

    const sortSelects = screen.getAllByDisplayValue('Más recientes');
    const sortSelect = sortSelects[0];

    fireEvent.change(sortSelect, { target: { value: 'oldest' } });

    waitFor(() => {
      expect(sortSelect).toHaveValue('oldest');
    });
  });

  it('calls cancelReservation when cancel is clicked', async () => {
    const mockCancelReservation = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(hooksModule, 'useReservationList').mockReturnValue({
      reservations: mockReservations,
      espacios: mockEspacios,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
      cancelReservation: mockCancelReservation,
    });

    render(<ReservationListPage />);

    const cancelButtons = screen.getAllByText('Cancelar Reserva');
    fireEvent.click(cancelButtons[0]);

    const confirmButtons = screen.getAllByText('Confirmar Cancelación');
    const confirmButton = confirmButtons.find((btn) => btn.tagName === 'BUTTON');
    fireEvent.click(confirmButton!);

    await waitFor(() => {
      expect(mockCancelReservation).toHaveBeenCalled();
    });
  });
});
