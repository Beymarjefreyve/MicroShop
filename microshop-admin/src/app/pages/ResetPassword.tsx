import { useState, FormEvent, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PrimaryButton } from '../components/auth/PrimaryButton';

import authService from '../services/authService';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!token) {
      setApiError('Falta el token de recuperación. Asegúrate de usar el enlace que enviamos a tu correo.');
    }
  }, [token]);

  const validateField = (name: string, value: string) => {
    let error = '';

    if (name === 'newPassword') {
      if (!value) error = 'La nueva contraseña es requerida';
      else if (value.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
    } else if (name === 'confirmPassword') {
      if (!value) error = 'Confirma tu contraseña';
      else if (value !== formData.newPassword) error = 'Las contraseñas no coinciden';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    setApiError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) return;

    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof typeof formData]);
    });

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) return;

    setLoading(true);
    setApiError('');

    try {
      await authService.resetPassword({
        token,
        newPassword: formData.newPassword
      });
      setSuccess(true);
    } catch (err: any) {
      setApiError(err.message || 'Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
            Contraseña restablecida
          </h2>
          <p className="text-[#6B7280] mb-8" style={{ fontSize: '14px' }}>
            Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión.
          </p>
          <Link to="/login">
            <PrimaryButton type="button">
              Ir al inicio de sesión
            </PrimaryButton>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <h2 className="text-center text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
        Restablecer contraseña
      </h2>
      <p className="text-center text-[#6B7280] mb-8" style={{ fontSize: '14px' }}>
        Ingresa tu nueva contraseña para recuperar el acceso
      </p>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm text-center">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <PasswordInput
          label="Nueva contraseña"
          id="newPassword"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          placeholder="••••••••"
          disabled={!token}
        />

        <PasswordInput
          label="Confirmar contraseña"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
          disabled={!token}
        />

        <PrimaryButton type="submit" loading={loading} disabled={!token}>
          Actualizar contraseña
        </PrimaryButton>
      </form>
    </AuthCard>
  );
}
