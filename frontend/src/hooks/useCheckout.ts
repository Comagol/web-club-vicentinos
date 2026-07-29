import { useState, useCallback } from 'react';
import { boutiqueService } from '../services/api';
import { ItemCarrito, Pedido } from '../types/models';

export interface UseCheckoutReturn {
  loading: boolean;
  error: string | null;
  pedidoCreado: Pedido | null;
  crearPedido: (socioId: string, items: ItemCarrito[], direccionEntrega?: string) => Promise<Pedido>;
  reset: () => void;
  clearError: () => void;
}

export const useCheckout = (): UseCheckoutReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pedidoCreado, setPedidoCreado] = useState<Pedido | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const crearPedido = useCallback(
    async (socioId: string, items: ItemCarrito[], _direccionEntrega?: string) => {
      // Note: _direccionEntrega is for future use when the API supports custom delivery addresses

      if (!socioId) {
        throw new Error('User not authenticated');
      }

      if (!items || items.length === 0) {
        throw new Error('Cart is empty');
      }

      setLoading(true);
      setError(null);

      try {
        // Validate items
        const validItems = items.filter((item) => {
          return (
            typeof item.productoId === 'string' &&
            typeof item.cantidad === 'number' &&
            typeof item.precioUnitario === 'number' &&
            item.cantidad > 0
          );
        });

        if (validItems.length === 0) {
          throw new Error('Invalid items in cart');
        }

        const response = await boutiqueService.crearPedido(socioId, validItems);
        const pedido = response.data.data;

        setPedidoCreado(pedido);
        return pedido;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setPedidoCreado(null);
  }, []);

  return {
    loading,
    error,
    pedidoCreado,
    crearPedido,
    reset,
    clearError,
  };
};
