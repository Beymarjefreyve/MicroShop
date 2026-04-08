import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { CheckoutStepper } from '../components/cart/CheckoutStepper';
import { OrderSummary } from '../components/cart/OrderSummary';
import { PaymentMethodCard } from '../components/cart/PaymentMethodCard';
import { CreditCardPreview } from '../components/cart/CreditCardPreview';
import { useCart } from '../hooks/useCart';

export function Payment() {
  const navigate = useNavigate();
  const { state } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'nequi' | 'card'>('card');
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Nequi form
  const [nequiPhone, setNequiPhone] = useState('');

  // Card form
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      // Format card number as 4-4-4-4
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    } else if (name === 'expiry') {
      // Format expiry as MM/YY
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    navigate('/checkout/confirmation');
  };

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 5.0;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <CheckoutStepper currentStep={2} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment method selection */}
              <div className="space-y-4">
                <h2 className="text-2xl text-[#111827] font-bold">Método de pago</h2>

                {/* Nequi */}
                <PaymentMethodCard
                  id="nequi"
                  title="Nequi"
                  description="Recibirás una solicitud de pago en tu app Nequi"
                  badge="Pago instantáneo"
                  selected={paymentMethod === 'nequi'}
                  onSelect={() => setPaymentMethod('nequi')}
                  icon={
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xl font-bold">N</span>
                    </div>
                  }
                />

                {paymentMethod === 'nequi' && (
                  <div className="ml-14 bg-gray-50 p-4 rounded-lg border border-[#E5E7EB]">
                    <label className="block text-[#111827] text-sm font-medium mb-2">
                      Número de teléfono
                    </label>
                    <input
                      type="tel"
                      value={nequiPhone}
                      onChange={(e) => setNequiPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="3001234567"
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>
                )}

                {/* Credit/Debit Card */}
                <PaymentMethodCard
                  id="card"
                  title="Tarjeta de crédito o débito"
                  selected={paymentMethod === 'card'}
                  onSelect={() => setPaymentMethod('card')}
                  icon={
                    <div className="flex gap-2">
                      <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                        <rect width="32" height="20" rx="4" fill="#1434CB" />
                        <circle cx="12" cy="10" r="5" fill="#EB001B" />
                        <circle cx="20" cy="10" r="5" fill="#F79E1B" opacity="0.8" />
                      </svg>
                    </div>
                  }
                />

                {paymentMethod === 'card' && (
                  <div className="ml-14 space-y-6">
                    {/* Card preview */}
                    <CreditCardPreview
                      cardNumber={cardData.number}
                      cardName={cardData.name}
                      expiryDate={cardData.expiry}
                    />

                    {/* Card form */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-[#E5E7EB] space-y-4">
                      <div>
                        <label className="block text-[#111827] text-sm font-medium mb-2">
                          Número de tarjeta
                        </label>
                        <input
                          type="text"
                          name="number"
                          value={cardData.number}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#111827] text-sm font-medium mb-2">
                          Nombre en la tarjeta
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={cardData.name}
                          onChange={handleCardChange}
                          placeholder="JUAN PEREZ"
                          className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                          style={{ textTransform: 'uppercase' }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[#111827] text-sm font-medium mb-2">
                            Fecha de vencimiento
                          </label>
                          <input
                            type="text"
                            name="expiry"
                            value={cardData.expiry}
                            onChange={handleCardChange}
                            placeholder="MM/AA"
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                          />
                        </div>
                        <div>
                          <label className="block text-[#111827] text-sm font-medium mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Resumen del pedido - Mobile/Accordion */}
              <div className="lg:hidden">
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-xl p-4 flex justify-between items-center"
                >
                  <span className="text-[#111827] font-semibold">
                    Ver resumen del pedido
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="2"
                    className={`transition-transform ${showSummary ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {showSummary && (
                  <div className="mt-4">
                    <OrderSummary subtotal={subtotal} showActions={false} />
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/checkout')}
                  className="flex-1 border-2 border-[#E5E7EB] text-[#6B7280] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Volver
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 bg-[#2563EB] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    `Pagar $${total.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>

            {/* Resumen - Desktop */}
            <div className="hidden lg:block lg:col-span-1">
              <OrderSummary subtotal={subtotal} showActions={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
