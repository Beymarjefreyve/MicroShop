import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import authService from '../services/authService';

type Step = 'email' | 'otp' | 'success';

export function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentId, setPaymentId] = useState<number | null>(null);

  // Pre-fill email from logged-in user
  useEffect(() => {
    const user = authService.getUser();
    if (user?.email) setEmail(user.email);
  }, []);

  useEffect(() => {
    if (!id) { navigate('/orders'); return; }
    orderService.getOrderById(Number(id))
      .then(setOrder)
      .catch(() => navigate('/orders'));
  }, [id, navigate]);

  // Step 1 — send OTP to email
  const handleSendOtp = async () => {
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Ingresa un correo electrónico válido');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await paymentService.initiatePayment(id!, email);
      setPaymentId(result.paymentId);
      setStep('otp');
    } catch (e: any) {
      setError(e.message || 'Error al enviar el código. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — confirm OTP
  const handleConfirmOtp = async () => {
    if (otp.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await paymentService.confirmPayment(id!, otp);
      // Mark order as PAGADO in order service
      await orderService.updateStatus(Number(id), 'PAGADO', 'Pago confirmado con OTP por email', 'Email OTP');
      setStep('success');
    } catch (e: any) {
      setError(e.message || 'Código incorrecto. Verifica tu correo e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]" />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          {/* Progress steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {(['email', 'otp', 'success'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === s ? 'bg-[#2563EB] text-white' :
                  (['email', 'otp', 'success'].indexOf(step) > i) ? 'bg-[#10b981] text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {(['email', 'otp', 'success'].indexOf(step) > i) ? '✓' : i + 1}
                </div>
                {i < 2 && <div className={`w-12 h-1 rounded ${(['email', 'otp', 'success'].indexOf(step) > i) ? 'bg-[#10b981]' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">

            {/* Order summary header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              </div>
              <p className="text-[#6B7280] text-sm">Pedido #{id}</p>
              <p className="text-[#111827] text-2xl font-bold mt-1">
                ${Number(order.total_amount).toFixed(2)}
              </p>
            </div>

            {/* ── STEP 1: Email ── */}
            {step === 'email' && (
              <div>
                <h2 className="text-[#111827] text-lg font-semibold mb-1">Confirma tu correo</h2>
                <p className="text-[#6B7280] text-sm mb-6">
                  Te enviaremos un código de 6 dígitos para confirmar el pago.
                </p>

                <label className="block text-[#111827] text-sm font-medium mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="tu@correo.com"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] ${error ? 'border-red-400' : 'border-[#E5E7EB]'}`}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full mt-6 bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"/></svg>Enviando...</>
                  ) : 'Enviar código'}
                </button>

                <button
                  onClick={() => navigate('/orders')}
                  className="w-full mt-3 text-[#6B7280] py-2 text-sm hover:text-[#111827] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* ── STEP 2: OTP ── */}
            {step === 'otp' && (
              <div>
                <h2 className="text-[#111827] text-lg font-semibold mb-1">Ingresa el código</h2>
                <p className="text-[#6B7280] text-sm mb-1">
                  Enviamos un código de 6 dígitos a:
                </p>
                <p className="text-[#2563EB] text-sm font-semibold mb-6">{email}</p>

                <label className="block text-[#111827] text-sm font-medium mb-2">
                  Código OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  placeholder="000000"
                  maxLength={6}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#111827] text-center text-2xl font-bold tracking-[12px] ${error ? 'border-red-400' : 'border-[#E5E7EB]'}`}
                  onKeyDown={e => e.key === 'Enter' && handleConfirmOtp()}
                />
                {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

                <button
                  onClick={handleConfirmOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full mt-6 bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"/></svg>Verificando...</>
                  ) : `Confirmar pago $${Number(order.total_amount).toFixed(2)}`}
                </button>

                <button
                  onClick={() => { setStep('email'); setOtp(''); setError(''); }}
                  className="w-full mt-3 text-[#6B7280] py-2 text-sm hover:text-[#111827] transition-colors"
                >
                  ← Cambiar correo
                </button>
              </div>
            )}

            {/* ── STEP 3: Success ── */}
            {step === 'success' && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-[#111827] text-xl font-bold mb-2">¡Pago confirmado!</h2>
                <p className="text-[#6B7280] text-sm mb-6">
                  Tu pedido #{id} ha sido pagado exitosamente.
                </p>
                <button
                  onClick={() => navigate(`/orders/${id}`)}
                  className="w-full bg-[#2563EB] text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Ver mi pedido
                </button>
                <button
                  onClick={() => navigate('/catalog')}
                  className="w-full mt-3 text-[#6B7280] py-2 text-sm hover:text-[#111827] transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
