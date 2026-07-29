import React from 'react';
import { X, ChevronRight, Trash2 } from 'lucide-react';
import { ItemCarrito } from '../../types/models';

interface CartSidebarProps {
  items: ItemCarrito[];
  total: number;
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (productoId: string) => void;
  onUpdateQuantity: (productoId: string, cantidad: number) => void;
  onCheckout: () => void;
  productos: Map<string, { nombre: string; imagen?: string }>;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  items,
  total,
  isOpen,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onCheckout,
  productos,
}) => {
  const isEmpty = items.length === 0;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-lg z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:shadow-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-navy-900">Carrito</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-full overflow-y-auto">
          {isEmpty ? (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-gray-600 mb-2">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm">
                Agrega productos para comenzar tu compra
              </p>
            </div>
          ) : (
            <div className="flex-grow p-4 md:p-6 space-y-4">
              {items.map((item) => {
                const producto = productos.get(item.productoId);
                const itemTotal = item.cantidad * item.precioUnitario;

                return (
                  <div
                    key={item.productoId}
                    className="flex gap-3 pb-4 border-b border-gray-200 last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {producto?.imagen ? (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">No image</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-sm font-semibold text-navy-900 line-clamp-2 mb-1">
                        {producto?.nombre || 'Producto'}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2">
                        ${item.precioUnitario.toLocaleString('es-AR')} c/u
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.productoId, item.cantidad - 1)
                          }
                          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm font-semibold"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.productoId, item.cantidad + 1)
                          }
                          className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm font-semibold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-sm font-bold text-navy-900">
                        ${itemTotal.toLocaleString('es-AR')}
                      </p>
                      <button
                        onClick={() => onRemoveItem(item.productoId)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isEmpty && (
            <div className="mt-auto border-t border-gray-200 p-4 md:p-6 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold text-navy-900">
                <span>Total:</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={onCheckout}
                className="w-full px-4 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-colors flex items-center justify-center gap-2"
              >
                Ir a checkout
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
