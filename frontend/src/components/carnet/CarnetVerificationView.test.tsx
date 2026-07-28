import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CarnetVerificationView } from './CarnetVerificationView';
import { Carnet } from '../../types/models';

describe('CarnetVerificationView', () => {
  const mockCarnet: Carnet = {
    id: 'carnet-123',
    socioId: 'socio-456',
    numeroSocio: 'S00123',
    qrCode: 'data:image/png;base64,abc123',
    estado: 'habilitado',
    fotoPerfil: 'https://example.com/photo.jpg',
    fechaVencimiento: '2025-12-31',
  };

  it('should render carnet verification view', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    expect(screen.getByText('Carnet Verificado')).toBeInTheDocument();
  });

  it('should display member number', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    expect(screen.getByText(`#${mockCarnet.numeroSocio}`)).toBeInTheDocument();
  });

  it('should display carnet status as Habilitado', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    expect(screen.getByText('Habilitado')).toBeInTheDocument();
  });

  it('should display carnet status as Inhabilitado when estado is inhabilitado', () => {
    const inhabilitadoCarnet: Carnet = {
      ...mockCarnet,
      estado: 'inhabilitado',
    };

    render(<CarnetVerificationView carnet={inhabilitadoCarnet} />);

    expect(screen.getByText('Inhabilitado')).toBeInTheDocument();
  });

  it('should display expiration date', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    // Check that vencimiento section is rendered
    expect(screen.getByText('Vencimiento')).toBeInTheDocument();
  });

  it('should display success message with verification time', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    expect(screen.getByText(/Verificado a las/)).toBeInTheDocument();
  });

  it('should display Club Vicentinos branding', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    expect(screen.getByText(/Club Vicentinos/)).toBeInTheDocument();
  });

  it('should render member avatar from fotoPerfil', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    const img = screen.getByRole('img', { name: /Member photo/ });
    expect(img).toHaveAttribute('src', mockCarnet.fotoPerfil);
  });

  it('should render initials when fotoPerfil is not available', () => {
    const carnetWithoutPhoto: Carnet = {
      ...mockCarnet,
      fotoPerfil: '',
    };

    render(<CarnetVerificationView carnet={carnetWithoutPhoto} />);

    // Should display initials from numeroSocio (first 2 chars)
    expect(screen.getByText('S0')).toBeInTheDocument();
  });

  it('should accept and display custom verificadoA time', () => {
    const customTime = new Date('2025-12-25T14:30:00');
    render(<CarnetVerificationView carnet={mockCarnet} verificadoA={customTime} />);

    expect(screen.getByText(/Verificado a las/)).toBeInTheDocument();
  });

  it('should display success badge for verification', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    // Check for success check mark
    const successIndicator = screen.getByText('Carnet Verificado');
    expect(successIndicator).toBeInTheDocument();
  });

  it('should not display sensitive information (carnet ID)', () => {
    render(<CarnetVerificationView carnet={mockCarnet} />);

    // Ensure carnet ID is not shown (should not find it)
    expect(screen.queryByText(/ID Carnet/)).not.toBeInTheDocument();
    expect(screen.queryByText(/carnet-1/)).not.toBeInTheDocument();
  });
});
