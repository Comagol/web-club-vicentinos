import { useState, useRef, useEffect, useCallback } from 'react';
import { boutiqueService } from '../services/api';
import { ProductosBoutique } from '../types/models';

export interface UseProductsReturn {
  productos: ProductosBoutique[];
  loading: boolean;
  error: string | null;
  filtrados: ProductosBoutique[];
  filtroCategoria: string[];
  filtroPrecio: { min: number; max: number };
  busqueda: string;
  setFiltroCategoria: (categorias: string[]) => void;
  setFiltroPrecio: (rango: { min: number; max: number }) => void;
  setBusqueda: (texto: string) => void;
  limpiarFiltros: () => void;
  getCategorias: () => string[];
  getPrecioRango: () => { min: number; max: number };
  refetch: () => Promise<void>;
  clearError: () => void;
}

interface CacheData {
  productos: ProductosBoutique[] | null;
  timestamp: number;
}

export const useProducts = (ttlMs: number = 10 * 60 * 1000): UseProductsReturn => {
  const [productos, setProductos] = useState<ProductosBoutique[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string[]>([]);
  const [filtroPrecio, setFiltroPrecio] = useState({ min: 0, max: 999999 });
  const [busqueda, setBusqueda] = useState('');

  const cacheRef = useRef<CacheData>({
    productos: null,
    timestamp: 0,
  });

  const isCacheValid = useCallback(() => {
    if (!cacheRef.current.productos) return false;
    const now = Date.now();
    return now - cacheRef.current.timestamp < ttlMs;
  }, [ttlMs]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await boutiqueService.getProductos();
      const productosData = response.data.data.items || [];

      cacheRef.current = {
        productos: productosData,
        timestamp: Date.now(),
      };

      setProductos(productosData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyFilters = useCallback((): ProductosBoutique[] => {
    let filtered = productos;

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.precio >= filtroPrecio.min && p.precio <= filtroPrecio.max
    );

    // Filter by categories
    if (filtroCategoria.length > 0) {
      filtered = filtered.filter((p) =>
        p.categorias.some((cat) => filtroCategoria.includes(cat))
      );
    }

    // Filter by search text
    if (busqueda.trim()) {
      const searchLower = busqueda.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchLower) ||
          p.descripcion.toLowerCase().includes(searchLower)
      );
    }

    // Only show active products
    filtered = filtered.filter((p) => p.activo);

    return filtered;
  }, [productos, filtroCategoria, filtroPrecio, busqueda]);

  const getCategorias = useCallback((): string[] => {
    const categorias = new Set<string>();
    productos.forEach((p) => {
      p.categorias.forEach((c) => categorias.add(c));
    });
    return Array.from(categorias).sort();
  }, [productos]);

  const getPrecioRango = useCallback((): { min: number; max: number } => {
    if (productos.length === 0) return { min: 0, max: 100 };
    const precios = productos.map((p) => p.precio);
    return {
      min: Math.floor(Math.min(...precios)),
      max: Math.ceil(Math.max(...precios)),
    };
  }, [productos]);

  const limpiarFiltros = useCallback(() => {
    setFiltroCategoria([]);
    setFiltroPrecio({ min: 0, max: 999999 });
    setBusqueda('');
  }, []);

  const refetch = useCallback(async () => {
    cacheRef.current = { productos: null, timestamp: 0 };
    await fetchProductos();
  }, [fetchProductos]);

  // Initial fetch
  useEffect(() => {
    if (isCacheValid()) {
      setProductos(cacheRef.current.productos || []);
      return;
    }
    fetchProductos();
  }, [isCacheValid, fetchProductos]);

  return {
    productos,
    loading,
    error,
    filtrados: applyFilters(),
    filtroCategoria,
    filtroPrecio,
    busqueda,
    setFiltroCategoria,
    setFiltroPrecio,
    setBusqueda,
    limpiarFiltros,
    getCategorias,
    getPrecioRango,
    refetch,
    clearError,
  };
};
