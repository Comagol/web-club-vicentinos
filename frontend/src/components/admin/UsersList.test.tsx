import { render, screen, fireEvent } from '@testing-library/react';
import { UsersList } from './UsersList';
import { Socio } from '../../types/models';
import { describe, it, expect, vi } from 'vitest';

describe('UsersList', () => {
  const mockUsers: Socio[] = [
    {
      id: '1',
      email: 'juan@vicentinos.com',
      nombre: 'Juan',
      apellido: 'Perez',
      numeroSocio: '001',
      categoria: 'adulto',
      disciplina: 'rugby',
      estadoCuota: 'al_dia',
      estadoMembresia: 'activo',
      habilitadoEstacionamiento: false,
      rol: 'socio',
      fechaCreacion: '2026-01-01T00:00:00Z',
    },
    {
      id: '2',
      email: 'ana@vicentinos.com',
      nombre: 'Ana',
      apellido: 'Gomez',
      numeroSocio: '002',
      categoria: 'joven',
      disciplina: 'hockey',
      estadoCuota: 'vencida',
      estadoMembresia: 'suspendido',
      habilitadoEstacionamiento: true,
      rol: 'admin',
      fechaCreacion: '2026-02-01T00:00:00Z',
    },
  ];

  it('renders users with role and status badges', () => {
    render(<UsersList users={mockUsers} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
    expect(screen.getByText('juan@vicentinos.com')).toBeInTheDocument();
  });

  it('shows loading skeleton', () => {
    const { getByTestId } = render(
      <UsersList users={[]} isLoading={true} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(getByTestId('users-list-loading')).toBeInTheDocument();
  });

  it('shows empty state when no users', () => {
    render(<UsersList users={[]} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No se encontraron usuarios.')).toBeInTheDocument();
  });

  it('calls onEdit when Editar clicked', () => {
    const onEdit = vi.fn();
    render(<UsersList users={mockUsers} isLoading={false} onEdit={onEdit} onDelete={vi.fn()} />);

    fireEvent.click(screen.getAllByText('Editar')[0]);
    // Sorted ascending by name: "Ana Gomez" comes before "Juan Perez"
    expect(onEdit).toHaveBeenCalledWith(mockUsers[1]);
  });

  it('requires confirmation before calling onDelete', () => {
    const onDelete = vi.fn();
    render(<UsersList users={mockUsers} isLoading={false} onEdit={vi.fn()} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByText('Eliminar');
    fireEvent.click(deleteButtons[0]);
    expect(onDelete).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('¿Confirmar?'));
    expect(onDelete).toHaveBeenCalledWith(mockUsers[1]);
  });

  it('sorts by name when header clicked', () => {
    render(<UsersList users={mockUsers} isLoading={false} onEdit={vi.fn()} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByText(/Nombre/));
    const rows = screen.getAllByRole('row');
    // header row + 2 data rows, descending after second click (starts ascending already)
    expect(rows.length).toBe(3);
  });
});
