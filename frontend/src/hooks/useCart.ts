import { useState, useCallback, useEffect } from 'react';
import { ItemCarrito } from '../types/models';

const CART_STORAGE_KEY = 'boutique_cart';

export interface UseCartReturn {
  items: ItemCarrito[];
  total: number;
  itemCount: number;
  agregarProducto: (productoId: string, cantidad: number, precioUnitario: number) => void;
  removerProducto: (productoId: string) => void;
  actualizarCantidad: (productoId: string, cantidad: number) => void;
  limpiar: () => void;
  getProductoEnCarrito: (productoId: string) => ItemCarrito | undefined;
}

export const useCart = (): UseCartReturn => {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ItemCarrito[];
        // Validate loaded data
        if (Array.isArray(parsed) && parsed.every(isValidCartItem)) {
          setItems(parsed);
        } else {
          setItems([]);
        }
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      setItems([]);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [items]);

  const isValidCartItem = (item: any): item is ItemCarrito => {
    return (
      typeof item === 'object' &&
      typeof item.productoId === 'string' &&
      typeof item.cantidad === 'number' &&
      typeof item.precioUnitario === 'number' &&
      item.cantidad > 0
    );
  };

  const agregarProducto = useCallback(
    (productoId: string, cantidad: number, precioUnitario: number) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.productoId === productoId);

        if (existing) {
          // Product already in cart, merge quantities
          return prev.map((item) =>
            item.productoId === productoId
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
        }

        // New product
        return [...prev, { productoId, cantidad, precioUnitario }];
      });
    },
    []
  );

  const removerProducto = useCallback((productoId: string) => {
    setItems((prev) => prev.filter((item) => item.productoId !== productoId));
  }, []);

  const actualizarCantidad = useCallback((productoId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removerProducto(productoId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productoId === productoId ? { ...item, cantidad } : item
      )
    );
  }, [removerProducto]);

  const limpiar = useCallback(() => {
    setItems([]);
  }, []);

  const getProductoEnCarrito = useCallback(
    (productoId: string) => items.find((item) => item.productoId === productoId),
    [items]
  );

  const total = items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0);
  const itemCount = items.reduce((count, item) => count + item.cantidad, 0);

  return {
    items,
    total,
    itemCount,
    agregarProducto,
    removerProducto,
    actualizarCantidad,
    limpiar,
    getProductoEnCarrito,
  };
};
