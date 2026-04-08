import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { CheckoutStepper } from '../components/cart/CheckoutStepper';
import { SuccessAnimation } from '../components/cart/SuccessAnimation';
import { useCart } from '../hooks/useCart';

export function Confirmation() {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();

  // Generate order number
  const orderNumber = `MS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  
  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate totals
  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 5.0;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  // Clear cart when leaving this page
  useEffect(() => {
    return () => {
      if (window.location.pathname !== '/checkout/confirmation') {
        clearCart();
      }
    };
  }, [clearCart]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <CheckoutStepper currentStep={3} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success animation */}
          <div className="mb-8">
            <SuccessAnimation />
          </div>

          {/* Success message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-green-600 font-bold mb-2">
              ¡Pago exitoso!
            </h1>
            <p className="text-[#6B7280]">
              Tu pedido ha sido procesado correctamente
            </p>
          </div>

          {/* Order details card */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6">
            <h2 className="text-xl text-[#111827] font-semibold mb-4">
              Detalles del pedido
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Número de pedido</span>
                <span className="text-[#111827] font-mono font-semibold">{orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Fecha y hora</span>
                <span className="text-[#111827]">
                  {dateStr} - {timeStr}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">Método de pago</span>
                <span className="text-[#111827]">Tarjeta de crédito</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#E5E7EB]">
                <span className="text-[#111827] font-semibold">Total pagado</span>
                <span className="text-[#111827] text-xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Products list */}
            <div className="border-t border-[#E5E7EB] pt-4">
              <h3 className="text-[#111827] font-medium mb-3">Productos</h3>
              <div className="space-y-2">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-[#6B7280]">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-[#111827]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email notification banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
              className="flex-shrink-0 mt-0.5"
            >
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <div>
              <p className="text-[#111827] font-medium">Confirmación enviada</p>
              <p className="text-[#6B7280] text-sm">
                Te enviamos la confirmación a tu correo en menos de 1 minuto
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                clearCart();
                navigate('/catalog');
              }}
              className="w-full border-2 border-[#2563EB] text-[#2563EB] py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Seguir comprando
            </button>
            <button
              onClick={() => {
                clearCart();
                navigate('/profile');
              }}
              className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Ver mis pedidos
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
