import React, { useState, useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ProductGrid } from '../components/boutique/ProductGrid';
import { FilterBar } from '../components/boutique/FilterBar';
import { ProductDetailModal } from '../components/boutique/ProductDetailModal';
import { CartSidebar } from '../components/boutique/CartSidebar';
import { CheckoutModal } from '../components/boutique/CheckoutModal';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useCheckout } from '../hooks/useCheckout';
import { useAuth } from '../hooks/useAuth';
import { ProductosBoutique } from '../types/models';

export const BoutiquePage: React.FC = () => {
  const { usuario } = useAuth();
  const {
    productos,
    loading,
    error,
    filtrados,
    filtroCategoria,
    filtroPrecio,
    busqueda,
    setFiltroCategoria,
    setFiltroPrecio,
    setBusqueda,
    limpiarFiltros,
    getCategorias,
    getPrecioRango,
  } = useProducts();

  const {
    items: cartItems,
    total: cartTotal,
    itemCount,
    agregarProducto,
    removerProducto,
    actualizarCantidad,
    limpiar: clearCart,
  } = useCart();

  const {
    loading: checkoutLoading,
    error: checkoutError,
    pedidoCreado,
    crearPedido,
    reset: resetCheckout,
  } = useCheckout();

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<ProductosBoutique | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const productosInfoMap = useMemo(
    () =>
      new Map(
        productos.map((p) => [p.id, { nombre: p.nombre, imagen: p.imagen }])
      ),
    [productos]
  );

  const handleViewDetails = (producto: ProductosBoutique) => {
    setSelectedProduct(producto);
    setShowDetailModal(true);
    setAddedProductId(null);
  };

  const handleAddToCart = (cantidad: number) => {
    if (!selectedProduct) return;

    agregarProducto(
      selectedProduct.id,
      cantidad,
      selectedProduct.precio
    );
    setAddedProductId(selectedProduct.id);
  };

  const handleCheckout = async () => {
    if (!usuario?.id) return;

    try {
      await crearPedido(usuario.id, cartItems);
      clearCart();
      setShowDetailModal(false);
      setShowCheckoutModal(false);
    } catch (err) {
      // Error is handled in useCheckout hook
      console.error('Checkout error:', err);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProduct(null);
  };

  const handleCloseCheckout = () => {
    if (pedidoCreado) {
      // Reset everything and close
      setShowCheckoutModal(false);
      resetCheckout();
    } else {
      setShowCheckoutModal(false);
    }
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:py-16">
          <h3 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
            Boutique
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              Error al cargar los productos. Por favor, intenta nuevamente más tarde.
            </p>
            {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-navy-900">
            Boutique
          </h1>
          <button
            onClick={() => setShowCartSidebar(true)}
            className="relative p-2 md:p-3 bg-navy-900 text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <ShoppingCart size={24} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <FilterBar
              categorias={getCategorias()}
              filtroCategoria={filtroCategoria}
              filtroPrecio={filtroPrecio}
              precioRango={getPrecioRango()}
              busqueda={busqueda}
              onFiltroCategoria={setFiltroCategoria}
              onFiltroPrecio={setFiltroPrecio}
              onBusqueda={setBusqueda}
              onLimpiarFiltros={limpiarFiltros}
            />
          </div>

          {/* Products */}
          <div className="md:col-span-3">
            <ProductGrid
              productos={filtrados}
              loading={loading}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <ProductDetailModal
        producto={selectedProduct}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        onAddToCart={handleAddToCart}
        isAdded={addedProductId === selectedProduct?.id}
      />

      <CartSidebar
        items={cartItems}
        total={cartTotal}
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
        onRemoveItem={removerProducto}
        onUpdateQuantity={actualizarCantidad}
        onCheckout={() => {
          setShowCartSidebar(false);
          setShowCheckoutModal(true);
        }}
        productos={productosInfoMap}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={handleCloseCheckout}
        items={cartItems}
        total={cartTotal}
        isLoading={checkoutLoading}
        error={checkoutError}
        onConfirmOrder={handleCheckout}
        pedidoId={pedidoCreado?.id}
        productos={productosInfoMap}
      />

      <Footer />
    </div>
  );
};
