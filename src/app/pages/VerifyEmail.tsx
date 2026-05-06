import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import { PrimaryButton } from '../components/auth/PrimaryButton';
import authService from '../services/authService';

export function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verificando tu cuenta...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token de verificación no encontrado.');
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus('success');
        setMessage('¡Tu cuenta ha sido verificada con éxito!');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Error al verificar la cuenta. El token puede haber expirado.');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <AuthCard>
      <div className="text-center py-4">
        {status === 'loading' && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-semibold text-[#111827] mb-2">Verificando...</h2>
            <p className="text-[#6B7280]">{message}</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">¡Excelente!</h2>
            <p className="text-[#6B7280] mb-8">{message}</p>
            <Link to="/login" className="w-full">
              <PrimaryButton>Ir al Inicio de Sesión</PrimaryButton>
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">Ups, algo salió mal</h2>
            <p className="text-[#6B7280] mb-8">{message}</p>
            <Link to="/register" className="w-full">
              <PrimaryButton variant="outline">Volver al Registro</PrimaryButton>
            </Link>
          </div>
        )}
      </div>
    </AuthCard>
  );
}
