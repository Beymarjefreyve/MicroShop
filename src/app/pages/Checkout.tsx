import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { OrderSummary } from '../components/cart/OrderSummary';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/orderService';
import authService from '../services/authService';

export function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, removeSelectedItems } = useCart();
  
  const selectedItemIds: number[] = location.state?.selectedItemIds || [];
  const checkoutItems = state.items.filter(item => selectedItemIds.includes(item.id));
  const [loading, setLoading] = useState(false);
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

  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 5.0;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  const handleContinue = async () => {
    if (validateForm()) {
      const user = authService.getUser();
      if (!user || !user.id) {
        alert('Debes iniciar sesión para realizar el pedido');
        return;
      }

      setLoading(true);
      try {
        await orderService.createOrder({
          user_id: user.id,
          user_name: user.name || '',
          user_email: user.email || '',
          total_amount: Number(total.toFixed(2)),
          tax_amount: Number(tax.toFixed(2)),
          shipping_address: `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.state} CP: ${formData.zipCode}. Tel: ${formData.phone}`,
          items: checkoutItems.map(item => ({
            product_id: item.product_id,
            product_name: item.name,
            product_image: item.image,
            quantity: item.quantity,
            price_at_purchase: item.price
          }))
        });
        
        // IMPORTANT: Use isCheckout = true to avoid restoring stock
        await removeSelectedItems(selectedItemIds, true);
        navigate('/orders');
      } catch (e: any) {
        console.error('Error creating order:', e);
        alert(`Hubo un error al procesar el pedido: ${e.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  if (state.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h2 className="text-xl text-[#111827] font-semibold mb-4">
                  Productos ({checkoutItems.length})
                </h2>
                <div className="space-y-3">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image && (item.image.startsWith('http') || item.image.startsWith('/media')) ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          )}
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

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 border-2 border-[#E5E7EB] text-[#6B7280] py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Volver al carrito
                </button>
                <button
                  onClick={handleContinue}
                  disabled={loading}
                  className="flex-1 bg-[#2563EB] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    'Generar orden'
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary subtotal={subtotal} showActions={false} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
