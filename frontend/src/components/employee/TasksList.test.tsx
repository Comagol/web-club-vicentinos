import { render, screen } from '@testing-library/react';
import { TasksList } from './TasksList';
import { describe, it, expect, vi } from 'vitest';
import { Tarea } from '../../types/models';

// Mock the TaskCard component
vi.mock('./TaskCard', () => ({
  TaskCard: ({ tarea }: { tarea: Tarea; onViewDetails: (id: string) => void }) => (
    <div data-testid={`task-card-${tarea.id}`}>
      {tarea.titulo}
    </div>
  ),
}));

describe('TasksList', () => {
  const mockTareas: Tarea[] = [
    {
      id: '1',
      titulo: 'Tarea 1',
      descripcion: 'Descripción 1',
      asignadoA: 'Juan',
      estado: 'pendiente',
      prioridad: 'alta',
      fechaVencimiento: '2024-08-15',
      createdAt: '2024-07-01',
    },
    {
      id: '2',
      titulo: 'Tarea 2',
      descripcion: 'Descripción 2',
      asignadoA: 'Pedro',
      estado: 'en_progreso',
      prioridad: 'media',
      fechaVencimiento: '2024-08-10',
      createdAt: '2024-07-02',
    },
    {
      id: '3',
      titulo: 'Tarea 3',
      descripcion: 'Descripción 3',
      asignadoA: 'María',
      estado: 'completado',
      prioridad: 'baja',
      fechaVencimiento: '2024-08-20',
      createdAt: '2024-07-03',
    },
  ];

  const mockOnViewDetails = vi.fn();

  beforeEach(() => {
    mockOnViewDetails.mockClear();
  });

  it('renders empty state when no tasks', () => {
    render(
      <TasksList
        tareas={[]}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('No hay tareas asignadas.')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <TasksList
        tareas={[]}
        isLoading={true}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('Cargando tareas...')).toBeInTheDocument();
  });

  it('renders all tasks', () => {
    render(
      <TasksList
        tareas={mockTareas}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('task-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('task-card-3')).toBeInTheDocument();
  });

  it('sorts tasks by fechaVencimiento in ascending order', () => {
    render(
      <TasksList
        tareas={mockTareas}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    );

    const taskCards = screen.getAllByTestId(/^task-card-/);

    // Tasks should be sorted by fechaVencimiento: 2024-08-10, 2024-08-15, 2024-08-20
    expect(taskCards[0]).toHaveTextContent('Tarea 2'); // 2024-08-10
    expect(taskCards[1]).toHaveTextContent('Tarea 1'); // 2024-08-15
    expect(taskCards[2]).toHaveTextContent('Tarea 3'); // 2024-08-20
  });

  it('passes correct props to TaskCard', () => {
    const { container } = render(
      <TasksList
        tareas={[mockTareas[0]]}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByTestId('task-card-1')).toBeInTheDocument();
  });

  it('renders with proper spacing', () => {
    const { container } = render(
      <TasksList
        tareas={mockTareas}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    );

    const wrapper = container.querySelector('.space-y-3');
    expect(wrapper).toBeInTheDocument();
  });

  it('centers loading text', () => {
    const { container } = render(
      <TasksList
        tareas={[]}
        isLoading={true}
        onViewDetails={mockOnViewDetails}
      />
    );

    const centerDiv = container.querySelector('.text-center');
    expect(centerDiv).toBeInTheDocument();
    expect(centerDiv).toHaveTextContent('Cargando tareas...');
  });

  it('centers empty state text', () => {
    const { container } = render(
      <TasksList
        tareas={[]}
        isLoading={false}
        onViewDetails={mockOnViewDetails}
      />
    );

    const centerDiv = container.querySelector('.text-center');
    expect(centerDiv).toBeInTheDocument();
    expect(centerDiv).toHaveTextContent('No hay tareas asignadas.');
  });
});
