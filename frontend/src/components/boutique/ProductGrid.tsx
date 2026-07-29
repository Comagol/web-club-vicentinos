import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductosBoutique } from '../../types/models';

interface ProductGridProps {
  productos: ProductosBoutique[];
  loading: boolean;
  onViewDetails: (producto: ProductosBoutique) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  productos,
  loading,
  onViewDetails,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg aspect-square animate-pulse" />
        ))}
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-2">No hay productos disponibles</p>
        <p className="text-gray-400 text-sm">Intenta ajustando los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};
