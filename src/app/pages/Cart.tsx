import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';

export function Cart() {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem } = useCart();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    // Select all by default when items load
    if (state.items.length > 0 && selectedItems.length === 0) {
      setSelectedItems(state.items.map(item => item.id));
    }
  }, [state.items]);

  const handleToggleSelect = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Selecciona al menos un producto para generar la orden.");
      return;
    }
    navigate('/checkout', { state: { selectedItemIds: selectedItems } });
  };

  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  if (state.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col items-center justify-center py-16">
              {/* Empty cart illustration */}
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                className="mb-8"
              >
                <circle cx="100" cy="100" r="80" fill="#F3F4F6" />
                <path
                  d="M60 70L50 80v70a10 10 0 0 0 10 10h80a10 10 0 0 0 10-10V80l-10-10z"
                  fill="white"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                />
                <line x1="50" y1="80" x2="150" y2="80" stroke="#E5E7EB" strokeWidth="3" />
                <path
                  d="M120 95a20 20 0 0 1-40 0"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>

              <h2 className="text-2xl text-[#111827] font-semibold mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-[#6B7280] mb-8">
                Agrega productos para comenzar tu compra
              </p>

              <button
                onClick={handleContinueShopping}
                className="bg-[#2563EB] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Ver productos
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const subtotal = state.items
    .filter(item => selectedItems.includes(item.id))
    .reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl text-[#111827] font-bold">Carrito de compras</h1>
            <button
              onClick={handleContinueShopping}
              className="text-[#2563EB] hover:underline font-medium flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Seguir comprando
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  isSelected={selectedItems.includes(item.id)}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                onCheckout={handleCheckout}
                onViewOrders={handleViewOrders}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
