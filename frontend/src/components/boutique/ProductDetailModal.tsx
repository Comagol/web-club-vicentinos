import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Check } from 'lucide-react';
import { ProductosBoutique } from '../../types/models';

interface ProductDetailModalProps {
  producto: ProductosBoutique | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cantidad: number) => void;
  isLoading?: boolean;
  isAdded?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  producto,
  isOpen,
  onClose,
  onAddToCart,
  isLoading = false,
  isAdded = false,
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCantidad(1);
      setShowSuccess(false);
    }
  }, [isOpen, producto]);

  useEffect(() => {
    if (isAdded) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdded]);

  if (!isOpen || !producto) return null;

  const isOutOfStock = producto.stock === 0;
  const canAddMore = cantidad < producto.stock;

  const handleAddToCart = () => {
    onAddToCart(cantidad);
    // Don't reset cantidad here - let parent handle it
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
            <h2 className="text-xl md:text-2xl font-bold text-navy-900">
              Detalles del producto
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6 grid md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
              {producto.imagen ? (
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">No image</div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-navy-900 mb-2">
                  {producto.nombre}
                </h3>
                {producto.categorias.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {producto.categorias.map((cat) => (
                      <span
                        key={cat}
                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-600">{producto.descripcion}</p>
              </div>

              {/* Price */}
              <div className="border-y border-gray-200 py-4">
                <p className="text-3xl font-bold text-navy-900">
                  ${producto.precio.toLocaleString('es-AR')}
                </p>
              </div>

              {/* Stock */}
              <div>
                {isOutOfStock ? (
                  <p className="text-red-500 font-semibold text-lg">Sin stock</p>
                ) : (
                  <p className="text-green-600 font-semibold">
                    Disponibles: {producto.stock} unidades
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Cantidad:
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      disabled={cantidad <= 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={20} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={producto.stock}
                      value={cantidad}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setCantidad(Math.min(Math.max(1, val), producto.stock));
                      }}
                      className="w-16 text-center border border-gray-300 rounded-lg px-2 py-2 font-semibold"
                    />
                    <button
                      onClick={() =>
                        setCantidad(Math.min(cantidad + 1, producto.stock))
                      }
                      disabled={!canAddMore}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isLoading}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-white transition-all ${
                  showSuccess
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-navy-900 hover:bg-navy-800 disabled:bg-gray-400'
                }`}
              >
                {isLoading ? (
                  <>Agregando...</>
                ) : showSuccess ? (
                  <>
                    <Check size={20} />
                    Agregado al carrito
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Agregar al carrito
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Continuar comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
