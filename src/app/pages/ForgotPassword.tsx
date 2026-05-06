import { useState, FormEvent } from 'react';
import { Link } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import { InputField } from '../components/auth/InputField';
import { PrimaryButton } from '../components/auth/PrimaryButton';
import authService from '../services/authService';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      setError('El correo electrónico es requerido');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Correo electrónico inválido');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) return;

    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al procesar tu solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-[#DBEAFE] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>

        <h2 className="text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-[#6B7280]" style={{ fontSize: '14px' }}>
          No te preocupes, te enviaremos instrucciones para recuperarla
        </p>
      </div>

      {success ? (
        <div>
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 mb-1" style={{ fontSize: '14px', fontWeight: '500' }}>
              ✓ Correo enviado exitosamente
            </p>
            <p className="text-green-700" style={{ fontSize: '13px' }}>
              Revisa tu correo, enviamos el enlace en menos de 2 minutos
            </p>
          </div>

          <Link to="/login">
            <PrimaryButton type="button">
              Volver al inicio de sesión
            </PrimaryButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <InputField
            label="Correo electrónico"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            error={error}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
            placeholder="tu@email.com"
          />

          <PrimaryButton type="submit" loading={loading}>
            Enviar enlace de recuperación
          </PrimaryButton>

          <div className="text-center mt-6">
            <Link
              to="/login"
              className="text-[#2563EB] hover:underline inline-flex items-center gap-1"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
}
