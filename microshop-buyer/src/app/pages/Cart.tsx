import { useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';

export function Cart() {
  const navigate = useNavigate();
  const { state, updateQuantity, removeItem } = useCart();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/catalog');
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

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl text-[#111827] font-bold mb-8">Carrito de compras</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <OrderSummary
                subtotal={subtotal}
                onCheckout={handleCheckout}
                onContinueShopping={handleContinueShopping}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
