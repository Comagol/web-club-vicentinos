import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';
import { describe, it, expect, vi } from 'vitest';
import { Tarea } from '../../types/models';

describe('TaskCard', () => {
  const mockTarea: Tarea = {
    id: '1',
    titulo: 'Implementar nueva funcionalidad',
    descripcion: 'Agregar soporte para las nuevas características',
    asignadoA: 'Juan Perez',
    estado: 'en_progreso',
    prioridad: 'alta',
    fechaVencimiento: '2024-08-15',
    createdAt: '2024-07-01',
  };

  const mockOnViewDetails = vi.fn();

  beforeEach(() => {
    mockOnViewDetails.mockClear();
  });

  it('renders task title and status', () => {
    render(
      <TaskCard
        tarea={mockTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('Implementar nueva funcionalidad')).toBeInTheDocument();
    expect(screen.getByText('En Progreso')).toBeInTheDocument();
  });

  it('shows priority badge with correct color for alta priority', () => {
    render(
      <TaskCard
        tarea={mockTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    const priorityBadge = screen.getByText('Alta');
    expect(priorityBadge).toHaveClass('bg-red-100');
    expect(priorityBadge).toHaveClass('text-red-800');
  });

  it('shows priority badge with correct color for media priority', () => {
    const mediaTarea = { ...mockTarea, prioridad: 'media' as const };
    render(
      <TaskCard
        tarea={mediaTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    const priorityBadge = screen.getByText('Media');
    expect(priorityBadge).toHaveClass('bg-amber-100');
    expect(priorityBadge).toHaveClass('text-amber-800');
  });

  it('shows priority badge with correct color for baja priority', () => {
    const bajaTarea = { ...mockTarea, prioridad: 'baja' as const };
    render(
      <TaskCard
        tarea={bajaTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    const priorityBadge = screen.getByText('Baja');
    expect(priorityBadge).toHaveClass('bg-green-100');
    expect(priorityBadge).toHaveClass('text-green-800');
  });

  it('calls onViewDetails when details button clicked', () => {
    render(
      <TaskCard
        tarea={mockTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    const button = screen.getByText('Ver detalles');
    fireEvent.click(button);

    expect(mockOnViewDetails).toHaveBeenCalledWith('1');
  });

  it('formats due date correctly', () => {
    render(
      <TaskCard
        tarea={mockTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('15 ago')).toBeInTheDocument();
  });

  it('displays "Pendiente" status correctly', () => {
    const pendienteTarea = { ...mockTarea, estado: 'pendiente' as const };
    render(
      <TaskCard
        tarea={pendienteTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('Pendiente')).toBeInTheDocument();
  });

  it('displays "Completado" status correctly', () => {
    const completadaTarea = { ...mockTarea, estado: 'completado' as const };
    render(
      <TaskCard
        tarea={completadaTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('Completado')).toBeInTheDocument();
  });

  it('renders with white background and proper styling', () => {
    const { container } = render(
      <TaskCard
        tarea={mockTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('rounded-lg');
  });

  it('shows hover shadow effect', () => {
    const { container } = render(
      <TaskCard
        tarea={mockTarea}
        onViewDetails={mockOnViewDetails}
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('hover:shadow-md');
  });
});
