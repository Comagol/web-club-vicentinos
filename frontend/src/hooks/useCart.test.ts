import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should add product to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({
      productoId: 'prod-1',
      cantidad: 2,
      precioUnitario: 100,
    });
    expect(result.current.total).toBe(200);
    expect(result.current.itemCount).toBe(2);
  });

  it('should merge duplicate products instead of adding new item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
      result.current.agregarProducto('prod-1', 3, 100);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(5);
    expect(result.current.total).toBe(500);
  });

  it('should add multiple different products', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
      result.current.agregarProducto('prod-2', 1, 250);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.total).toBe(450);
    expect(result.current.itemCount).toBe(3);
  });

  it('should remove product from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
      result.current.agregarProducto('prod-2', 1, 250);
    });

    act(() => {
      result.current.removerProducto('prod-1');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productoId).toBe('prod-2');
    expect(result.current.total).toBe(250);
  });

  it('should update product quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
    });

    act(() => {
      result.current.actualizarCantidad('prod-1', 5);
    });

    expect(result.current.items[0].cantidad).toBe(5);
    expect(result.current.total).toBe(500);
  });

  it('should remove product when quantity set to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
    });

    act(() => {
      result.current.actualizarCantidad('prod-1', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should clear entire cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
      result.current.agregarProducto('prod-2', 1, 250);
    });

    act(() => {
      result.current.limpiar();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
    });

    const stored = localStorage.getItem('boutique_cart');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed).toEqual([
      { productoId: 'prod-1', cantidad: 2, precioUnitario: 100 },
    ]);
  });

  it('should restore cart from localStorage', () => {
    const cartData = [
      { productoId: 'prod-1', cantidad: 2, precioUnitario: 100 },
      { productoId: 'prod-2', cantidad: 1, precioUnitario: 250 },
    ];
    localStorage.setItem('boutique_cart', JSON.stringify(cartData));

    const { result } = renderHook(() => useCart());

    // Wait for useEffect to load from storage
    expect(result.current.items).toEqual(cartData);
    expect(result.current.total).toBe(450);
  });

  it('should get product in cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.agregarProducto('prod-1', 2, 100);
    });

    const producto = result.current.getProductoEnCarrito('prod-1');
    expect(producto).toEqual({
      productoId: 'prod-1',
      cantidad: 2,
      precioUnitario: 100,
    });
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem('boutique_cart', 'invalid json');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
  });

  it('should handle malformed cart data', () => {
    const malformedData = [
      { productoId: 'prod-1', cantidad: 2 }, // Missing precioUnitario
      { cantidad: 1, precioUnitario: 100 }, // Missing productoId
    ];
    localStorage.setItem('boutique_cart', JSON.stringify(malformedData));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
  });
});
