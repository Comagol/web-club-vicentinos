import { render, screen, fireEvent } from '@testing-library/react';
import { TaskFilterBar } from './TaskFilterBar';
import { describe, it, expect, vi } from 'vitest';

describe('TaskFilterBar', () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it('renders status and priority filters', () => {
    render(
      <TaskFilterBar
        filters={{ estado: undefined, prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText('Pendiente')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
    expect(screen.getByText('Completado')).toBeInTheDocument();
    expect(screen.getByText('Baja')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
  });

  it('calls onFilterChange when status filter changes', () => {
    render(
      <TaskFilterBar
        filters={{ estado: undefined, prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const pendienteButton = screen.getByText('Pendiente');
    fireEvent.click(pendienteButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('pendiente', undefined);
  });

  it('calls onFilterChange when priority filter changes', () => {
    render(
      <TaskFilterBar
        filters={{ estado: undefined, prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const altaButton = screen.getByText('Alta');
    fireEvent.click(altaButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(undefined, 'alta');
  });

  it('shows active state for selected status filter', () => {
    render(
      <TaskFilterBar
        filters={{ estado: 'pendiente', prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const pendienteButton = screen.getByText('Pendiente').closest('button');
    expect(pendienteButton).toHaveClass('bg-navy-800');
    expect(pendienteButton).toHaveClass('text-white');
  });

  it('shows active state for selected priority filter', () => {
    render(
      <TaskFilterBar
        filters={{ estado: undefined, prioridad: 'alta' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const altaButton = screen.getByText('Alta').closest('button');
    expect(altaButton).toHaveClass('bg-navy-800');
    expect(altaButton).toHaveClass('text-white');
  });

  it('toggles filter off when clicking active filter', () => {
    render(
      <TaskFilterBar
        filters={{ estado: 'pendiente', prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const pendienteButton = screen.getByText('Pendiente');
    fireEvent.click(pendienteButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(undefined, undefined);
  });

  it('shows "Limpiar filtros" button only when filters are active', () => {
    const { rerender } = render(
      <TaskFilterBar
        filters={{ estado: undefined, prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.queryByText('Limpiar filtros')).not.toBeInTheDocument();

    rerender(
      <TaskFilterBar
        filters={{ estado: 'pendiente', prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText('Limpiar filtros')).toBeInTheDocument();
  });

  it('clears all filters when reset button is clicked', () => {
    render(
      <TaskFilterBar
        filters={{ estado: 'pendiente', prioridad: 'alta' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const resetButton = screen.getByText('Limpiar filtros');
    fireEvent.click(resetButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(undefined, undefined);
  });

  it('allows multiple filters to be active simultaneously', () => {
    const { rerender } = render(
      <TaskFilterBar
        filters={{ estado: 'pendiente', prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const altaButton = screen.getByText('Alta');
    fireEvent.click(altaButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('pendiente', 'alta');

    rerender(
      <TaskFilterBar
        filters={{ estado: 'pendiente', prioridad: 'alta' }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const pendienteButton = screen.getByText('Pendiente').closest('button');
    const altaButtonAfter = screen.getByText('Alta').closest('button');

    expect(pendienteButton).toHaveClass('bg-navy-800');
    expect(altaButtonAfter).toHaveClass('bg-navy-800');
  });

  it('shows inactive state for unselected filters', () => {
    render(
      <TaskFilterBar
        filters={{ estado: undefined, prioridad: undefined }}
        onFilterChange={mockOnFilterChange}
      />
    );

    const pendienteButton = screen.getByText('Pendiente').closest('button');
    expect(pendienteButton).toHaveClass('bg-neutral-100');
    expect(pendienteButton).toHaveClass('text-neutral-700');
  });
});
