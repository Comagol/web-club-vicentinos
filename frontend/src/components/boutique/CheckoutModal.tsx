import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { ItemCarrito } from '../../types/models';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ItemCarrito[];
  total: number;
  isLoading: boolean;
  error: string | null;
  onConfirmOrder: () => Promise<void>;
  pedidoId?: string;
  productos: Map<string, { nombre: string }>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  total,
  isLoading,
  error,
  onConfirmOrder,
  pedidoId,
  productos,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setLocalError(error);
  }, [error]);

  if (!isOpen) return null;

  const isEmpty = items.length === 0;
  const orderCompleted = !!pedidoId;

  const handleConfirm = async () => {
    setLocalError(null);
    setIsProcessing(true);
    try {
      await onConfirmOrder();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Error al crear el pedido');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={orderCompleted ? undefined : onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          {!orderCompleted && (
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl md:text-2xl font-bold text-navy-900">
                Finalizar compra
              </h2>
              {!isProcessing && (
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-4 md:p-6">
            {orderCompleted ? (
              // Order Confirmation
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-navy-900 mb-2">
                  ¡Pedido confirmado!
                </h3>
                <p className="text-gray-600 mb-4">
                  Tu pedido ha sido creado exitosamente
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-1">Número de pedido:</p>
                  <p className="text-2xl font-bold text-navy-900">{pedidoId}</p>
                </div>
                <p className="text-gray-600 mb-6">
                  Recibirás un correo de confirmación con los detalles del envío.
                </p>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : isEmpty ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">El carrito está vacío</p>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-400"
                >
                  Volver a la tienda
                </button>
              </div>
            ) : (
              <>
                {/* Order Summary */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-navy-900 mb-4">
                    Resumen del pedido
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => {
                      const producto = productos.get(item.productoId);
                      const itemTotal = item.cantidad * item.precioUnitario;
                      return (
                        <div
                          key={item.productoId}
                          className="flex justify-between items-center"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {producto?.nombre || 'Producto'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.cantidad}x ${item.precioUnitario.toLocaleString('es-AR')}
                            </p>
                          </div>
                          <p className="font-bold text-navy-900">
                            ${itemTotal.toLocaleString('es-AR')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-navy-900">Total:</span>
                    <span className="text-navy-900">
                      ${total.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {localError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-800">Error</p>
                      <p className="text-red-700 text-sm">{localError}</p>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleConfirm}
                    disabled={isProcessing || isLoading}
                    className="w-full px-4 py-3 bg-navy-900 text-white rounded-lg font-bold hover:bg-navy-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isProcessing || isLoading ? (
                      'Procesando...'
                    ) : (
                      'Confirmar pedido'
                    )}
                  </button>
                  {!isProcessing && !isLoading && (
                    <button
                      onClick={onClose}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
