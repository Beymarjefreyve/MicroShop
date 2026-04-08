import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { CheckoutStepper } from '../components/cart/CheckoutStepper';
import { OrderSummary } from '../components/cart/OrderSummary';
import { useCart } from '../hooks/useCart';

export function Checkout() {
  const navigate = useNavigate();
  const { state } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio';
    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria';
    if (!formData.state.trim()) newErrors.state = 'El departamento es obligatorio';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'El código postal es obligatorio';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      navigate('/checkout/payment');
    }
  };

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <CheckoutStepper currentStep={1} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-6">
              {/* Productos del carrito */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h2 className="text-xl text-[#111827] font-semibold mb-4">
                  Productos ({state.items.length})
                </h2>
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-[#111827] font-medium">{item.name}</div>
                          <div className="text-[#6B7280] text-sm">Cantidad: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-[#111827] font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dirección de envío */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h2 className="text-xl text-[#111827] font-semibold mb-4">
                  Dirección de envío
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-[#111827] text-sm font-medium mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        errors.fullName ? 'border-red-500' : 'border-[#E5E7EB]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[#111827] text-sm font-medium mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        errors.address ? 'border-red-500' : 'border-[#E5E7EB]'
                      }`}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#111827] text-sm font-medium mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        errors.city ? 'border-red-500' : 'border-[#E5E7EB]'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#111827] text-sm font-medium mb-2">
                      Departamento *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        errors.state ? 'border-red-500' : 'border-[#E5E7EB]'
                      }`}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#111827] text-sm font-medium mb-2">
                      Código postal *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        errors.zipCode ? 'border-red-500' : 'border-[#E5E7EB]'
                      }`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[#111827] text-sm font-medium mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                        errors.phone ? 'border-red-500' : 'border-[#E5E7EB]'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 border-2 border-[#E5E7EB] text-[#6B7280] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Volver al carrito
                </button>
                <button
                  onClick={handleContinue}
                  className="flex-1 bg-[#2563EB] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continuar al pago
                </button>
              </div>
            </div>

            {/* Resumen */}
            <div className="lg:col-span-1">
              <OrderSummary subtotal={subtotal} showActions={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
