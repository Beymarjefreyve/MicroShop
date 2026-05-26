const API_URL = import.meta.env.VITE_PAYMENT_API_URL || 'http://localhost:8008/api/payments';

export const paymentService = {
  async initiatePayment(orderId: string, email: string): Promise<{ paymentId: number; status: string; message: string }> {
    const response = await fetch(`${API_URL}/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, email }),
    });
    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Error al iniciar pago: ${err}`);
    }
    return response.json();
  },

  async confirmPayment(orderId: string, otpCode: string): Promise<{ message: string; status: string }> {
    const response = await fetch(`${API_URL}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, otpCode }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'OTP inválido o pago no encontrado');
    }
    return data;
  },
};
