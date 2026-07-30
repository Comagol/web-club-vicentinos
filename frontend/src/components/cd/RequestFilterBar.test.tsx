import { render, screen, fireEvent } from '@testing-library/react';
import { RequestFilterBar } from './RequestFilterBar';
import { describe, it, expect, vi } from 'vitest';

describe('RequestFilterBar', () => {
  it('calls onApply with the selected filters', () => {
    const onApply = vi.fn();
    render(
      <RequestFilterBar status="all" tipo="all" search="" onApply={onApply} onClear={vi.fn()} />,
    );

    fireEvent.change(screen.getByLabelText('Estado'), { target: { value: 'pendiente' } });
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'reserva' } });
    fireEvent.change(screen.getByLabelText('Solicitante'), { target: { value: 'Juan' } });
    fireEvent.click(screen.getByText('Aplicar'));

    expect(onApply).toHaveBeenCalledWith({ status: 'pendiente', tipo: 'reserva', search: 'Juan' });
  });

  it('calls onClear when Limpiar is clicked', () => {
    const onClear = vi.fn();
    render(
      <RequestFilterBar
        status="pendiente"
        tipo="reserva"
        search="Juan"
        onApply={vi.fn()}
        onClear={onClear}
      />,
    );

    fireEvent.click(screen.getByText('Limpiar'));
    expect(onClear).toHaveBeenCalled();
  });
});
