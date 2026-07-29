import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TasksList } from './TasksList';
import { describe, it, expect, vi } from 'vitest';

describe('TasksList', () => {
  const mockTareas = [
    {
      id: '1',
      titulo: 'Limpiar salón',
      descripcion: 'Limpiar salón principal',
      asignadoA: 'Juan',
      estado: 'pendiente' as const,
      prioridad: 'alta' as const,
      fechaVencimiento: '2026-08-15',
      createdAt: '2026-07-28T00:00:00Z',
    },
    {
      id: '2',
      titulo: 'Reparar puerta',
      descripcion: 'Reparar puerta del salón B',
      asignadoA: 'Pedro',
      estado: 'en_progreso' as const,
      prioridad: 'media' as const,
      fechaVencimiento: '2026-08-20',
      createdAt: '2026-07-28T00:00:00Z',
    },
  ];

  it('renders tasks list', () => {
    render(
      <TasksList
        tareas={mockTareas}
        loading={false}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByText('Limpiar salón')).toBeInTheDocument();
    expect(screen.getByText('Reparar puerta')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { container } = render(
      <TasksList
        tareas={[]}
        loading={true}
        onStatusChange={vi.fn()}
      />
    );

    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('shows empty state when no tasks', () => {
    render(
      <TasksList
        tareas={[]}
        loading={false}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByText('No hay tareas')).toBeInTheDocument();
  });

  it('filters tasks by status', () => {
    render(
      <TasksList
        tareas={mockTareas}
        loading={false}
        onStatusChange={vi.fn()}
        filterStatus="pendiente"
      />
    );

    expect(screen.getByText('Limpiar salón')).toBeInTheDocument();
    expect(screen.queryByText('Reparar puerta')).not.toBeInTheDocument();
  });

  it('displays task priority badges', () => {
    render(
      <TasksList
        tareas={mockTareas}
        loading={false}
        onStatusChange={vi.fn()}
      />
    );

    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('Media')).toBeInTheDocument();
  });
});
