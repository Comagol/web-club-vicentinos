import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CarnetVerificationPage } from './CarnetVerificationPage';
import { useCarnetPublic } from '../hooks/useCarnetPublic';

// Mock the useCarnetPublic hook
vi.mock('../hooks/useCarnetPublic');

// Mock the carnet verification view
vi.mock('../components/carnet/CarnetVerificationView', () => ({
  CarnetVerificationView: ({ carnet }: any) => (
    <div data-testid="carnet-view">Carnet: {carnet.numeroSocio}</div>
  ),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'carnet-123' }),
    useNavigate: () => vi.fn(),
  };
});

describe('CarnetVerificationPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCarnet = {
    id: 'carnet-123',
    socioId: 'socio-456',
    numeroSocio: 'S00123',
    qrCode: 'data:image/png;base64,abc123',
    estado: 'habilitado' as const,
    fotoPerfil: 'https://example.com/photo.jpg',
    fechaVencimiento: '2025-12-31',
  };

  const renderPage = () => {
    return render(
      <BrowserRouter>
        <CarnetVerificationPage />
      </BrowserRouter>
    );
  };

  it('should render page title', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Verificación de Carnet')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Verificando carnet...')).toBeInTheDocument();
  });

  it('should display carnet data on success', async () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: mockCarnet,
      isLoading: false,
      error: null,
      isValid: true,
      refetch: vi.fn(),
    });

    renderPage();

    await waitFor(() => {
      expect(screen.getByTestId('carnet-view')).toBeInTheDocument();
      expect(screen.getByText(`Carnet: ${mockCarnet.numeroSocio}`)).toBeInTheDocument();
    });
  });

  it('should display error state', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Carnet no encontrado',
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('No se pudo verificar el carnet')).toBeInTheDocument();
    expect(screen.getByText('Carnet no encontrado')).toBeInTheDocument();
  });

  it('should show retry button on error', () => {
    const refetchMock = vi.fn();

    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Carnet no encontrado',
      isValid: false,
      refetch: refetchMock,
    });

    renderPage();

    const retryButton = screen.getByRole('button', { name: /Intentar de nuevo/ });
    fireEvent.click(retryButton);

    expect(refetchMock).toHaveBeenCalled();
  });

  it('should display helpful message for not found error', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Carnet no encontrado',
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText(/Verifica que el ID o QR sea correcto/)).toBeInTheDocument();
  });

  it('should display header and footer', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Verificación de Carnet')).toBeInTheDocument();
    expect(screen.getByText(/Club Vicentinos - Verificación Digital de Carnets/)).toBeInTheDocument();
  });

  it('should have navigation buttons', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Carnet no encontrado',
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByRole('button', { name: /Volver/ })).toBeInTheDocument();
  });

  it('should display subheader text', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText(/Escanea o accede mediante enlace para verificar un carnet/)).toBeInTheDocument();
  });

  it('should show error state for inhabilitado carnet', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: false,
      error: 'Carnet inhabilitado',
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('No se pudo verificar el carnet')).toBeInTheDocument();
    expect(screen.getByText('Carnet inhabilitado')).toBeInTheDocument();
  });

  it('should display loading spinner', () => {
    vi.mocked(useCarnetPublic).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      isValid: false,
      refetch: vi.fn(),
    });

    renderPage();

    expect(screen.getByText('Por favor espera mientras verificamos tu carnet')).toBeInTheDocument();
  });
});
