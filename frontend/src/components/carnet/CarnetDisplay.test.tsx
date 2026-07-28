import { render, screen } from '@testing-library/react';
import { CarnetDisplay } from './CarnetDisplay';
import { Carnet, Socio } from '../../types/models';
import { describe, it, expect } from 'vitest';

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

describe('CarnetDisplay', () => {
  it('renders carnet card', () => {
    render(<CarnetDisplay carnet={mockCarnet} member={mockMember} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Socio #001234')).toBeInTheDocument();
  });

  it('displays member discipline badge', () => {
    render(<CarnetDisplay carnet={mockCarnet} member={mockMember} />);

    expect(screen.getByText('Rugby')).toBeInTheDocument();
  });

  it('displays member category badge', () => {
    render(<CarnetDisplay carnet={mockCarnet} member={mockMember} />);

    expect(screen.getByText('Adulto')).toBeInTheDocument();
  });

  it('displays membership status', () => {
    render(<CarnetDisplay carnet={mockCarnet} member={mockMember} />);

    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('displays carnet ID', () => {
    const { container } = render(<CarnetDisplay carnet={mockCarnet} member={mockMember} />);

    // Get all elements with carnet-123 text and find the one in the footer
    const elements = screen.getAllByText('carnet-123');
    expect(elements.length).toBeGreaterThan(0);
  });

  it('displays carnet status', () => {
    render(<CarnetDisplay carnet={mockCarnet} member={mockMember} />);

    expect(screen.getByText('Habilitado')).toBeInTheDocument();
  });

  it('renders QR code section', () => {
    const { container } = render(<CarnetDisplay carnet={mockCarnet} member={mockMember} />);

    // Check for QR code section by finding h3 element with specific text
    const qrHeadings = container.querySelectorAll('h3');
    const hasQRHeading = Array.from(qrHeadings).some(h => h.textContent?.includes('Código de Verificación'));
    expect(hasQRHeading).toBeTruthy();
  });

  it('handles different discipline types', () => {
    const hockeyMember: Socio = {
      ...mockMember,
      disciplina: 'hockey',
    };

    render(<CarnetDisplay carnet={mockCarnet} member={hockeyMember} />);

    expect(screen.getByText('Hockey')).toBeInTheDocument();
  });

  it('handles different membership status', () => {
    const suspendedMember: Socio = {
      ...mockMember,
      estadoMembresia: 'suspendido',
    };

    render(<CarnetDisplay carnet={mockCarnet} member={suspendedMember} />);

    expect(screen.getByText('Suspendido')).toBeInTheDocument();
  });
});
