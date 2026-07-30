import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateUserModal } from './CreateUserModal';
import { describe, it, expect, vi } from 'vitest';

describe('CreateUserModal', () => {
  it('does not render when closed', () => {
    const { container } = render(
      <CreateUserModal isOpen={false} onClose={vi.fn()} onSubmit={vi.fn()} />,
    );
    expect(container.querySelector('input')).not.toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    const onSubmit = vi.fn();
    render(<CreateUserModal isOpen={true} onClose={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.click(screen.getByText('Crear usuario'));

    expect(await screen.findByText('El email es obligatorio')).toBeInTheDocument();
    expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email format', async () => {
    render(<CreateUserModal isOpen={true} onClose={vi.fn()} onSubmit={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    fireEvent.click(screen.getByText('Crear usuario'));

    expect(await screen.findByText('Email inválido')).toBeInTheDocument();
  });

  it('submits valid form data', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<CreateUserModal isOpen={true} onClose={vi.fn()} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@vicentinos.com' } });
    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'User' } });
    fireEvent.change(screen.getByLabelText('Número de socio'), { target: { value: '123' } });

    fireEvent.click(screen.getByText('Crear usuario'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@vicentinos.com',
          nombre: 'Test',
          apellido: 'User',
          numeroSocio: '123',
          rol: 'socio',
        }),
      );
    });

    expect(await screen.findByText('Usuario creado correctamente.')).toBeInTheDocument();
  });
});
