import { render, screen, fireEvent } from '@testing-library/react';
import { EspacioCard } from './EspacioCard';
import { describe, it, expect, vi } from 'vitest';

describe('EspacioCard', () => {
  const mockEspacio = {
    id: '1',
    nombre: 'Salón Principal',
    capacidad: 100,
    descripcion: 'Un hermoso salón',
    activo: true,
  };

  it('renders space information', () => {
    const mockClick = vi.fn();
    render(
      <EspacioCard
        espacio={mockEspacio}
        bookingsCount={3}
        onDetailClick={mockClick}
      />
    );

    expect(screen.getByText('Salón Principal')).toBeInTheDocument();
    expect(screen.getByText('Un hermoso salón')).toBeInTheDocument();
    expect(screen.getByText('Capacidad: 100')).toBeInTheDocument();
    expect(screen.getByText('3 reservas')).toBeInTheDocument();
  });

  it('shows active status badge', () => {
    const mockClick = vi.fn();
    render(
      <EspacioCard
        espacio={mockEspacio}
        onDetailClick={mockClick}
      />
    );

    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('shows inactive status badge when not active', () => {
    const mockClick = vi.fn();
    const inactiveEspacio = { ...mockEspacio, activo: false };
    render(
      <EspacioCard
        espacio={inactiveEspacio}
        onDetailClick={mockClick}
      />
    );

    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });

  it('calls onDetailClick when button is clicked', () => {
    const mockClick = vi.fn();
    render(
      <EspacioCard
        espacio={mockEspacio}
        onDetailClick={mockClick}
      />
    );

    fireEvent.click(screen.getByText('Ver detalles'));
    expect(mockClick).toHaveBeenCalledWith(mockEspacio);
  });
});
