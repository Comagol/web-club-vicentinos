import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { ProductosBoutique } from '../../types/models';

interface ProductCardProps {
  producto: ProductosBoutique;
  onViewDetails: (producto: ProductosBoutique) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ producto, onViewDetails }) => {
  const isOutOfStock = producto.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
      {/* Product Image Container */}
      <div className="relative bg-gray-100 aspect-square flex items-center justify-center overflow-hidden">
        {producto.imagen && (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        )}
        {!producto.imagen && (
          <div className="text-gray-400 text-sm">No image</div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          {isOutOfStock ? (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              Sin stock
            </span>
          ) : (
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
              En stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Category Badge */}
        {producto.categorias.length > 0 && (
          <div className="mb-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
              {producto.categorias[0]}
            </span>
          </div>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-bold text-navy-900 mb-1 line-clamp-2">
          {producto.nombre}
        </h3>

        {/* Product Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {producto.descripcion}
        </p>

        {/* Price */}
        <div className="mb-3 mt-auto">
          <p className="text-lg font-bold text-navy-900">
            ${producto.precio.toLocaleString('es-AR')}
          </p>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(producto)}
          disabled={isOutOfStock}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-navy-900 text-white rounded-lg font-semibold hover:bg-navy-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={16} />
          Ver detalles
        </button>
      </div>
    </div>
  );
};
