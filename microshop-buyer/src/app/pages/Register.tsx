import { useState, FormEvent } from 'react';
import { Link } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import { InputField } from '../components/auth/InputField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PrimaryButton } from '../components/auth/PrimaryButton';

import authService from '../services/authService';

export function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [roles, setRoles] = useState<string[]>(['buyer']);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) error = 'El nombre completo es requerido';
        else if (value.trim().length < 3) error = 'El nombre debe tener al menos 3 caracteres';
        break;
      case 'email':
        if (!value) error = 'El correo electrónico es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Correo electrónico inválido';
        break;
      case 'password':
        if (!value) error = 'La contraseña es requerida';
        else if (value.length < 6) error = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'confirmPassword':
        if (!value) error = 'Confirma tu contraseña';
        else if (value !== formData.password) error = 'Las contraseñas no coinciden';
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
    setApiError('');
  };

  const toggleRole = (role: string) => {
    setRoles(prev => {
      if (prev.includes(role)) {
        if (prev.length === 1) return prev; // Must have at least one role
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof typeof formData]);
    });

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors || !acceptTerms) return;

    setLoading(true);
    setApiError('');

    try {
      await authService.register(formData, roles);
      setSuccess(true);
    } catch (error: any) {
      setApiError(error.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <h2 className="text-center text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
        Crear cuenta
      </h2>
      <p className="text-center text-[#6B7280] mb-6" style={{ fontSize: '14px' }}>
        Únete a MicroShop y comienza a comprar
      </p>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
          {apiError}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800" style={{ fontSize: '14px' }}>
            ✓ Te enviamos un correo de verificación
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-[#374151] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
            Quiero registrarme como:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toggleRole('buyer')}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                roles.includes('buyer')
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              Comprador
            </button>
            <button
              type="button"
              onClick={() => toggleRole('seller')}
              className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                roles.includes('seller')
                  ? 'bg-[#2563EB] text-white shadow-md'
                  : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
              }`}
            >
              Vendedor
            </button>
          </div>
          <p className="mt-2 text-xs text-[#9CA3AF]">
            * Puedes seleccionar ambos roles
          </p>
        </div>

        <InputField
          label="Nombre completo"
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          placeholder="Juan Pérez"
        />

        <InputField
          label="Correo electrónico"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          }
          placeholder="tu@email.com"
        />

        <PasswordInput
          label="Contraseña"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="••••••••"
        />

        <PasswordInput
          label="Confirmar contraseña"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="••••••••"
        />

        <div className="mb-6 flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="mt-1 w-4 h-4 border-[#D1D5DB] rounded accent-[#2563EB] cursor-pointer"
          />
          <label htmlFor="terms" className="text-[#6B7280] cursor-pointer" style={{ fontSize: '14px' }}>
            Acepto los{' '}
            <a href="#" className="text-[#2563EB] hover:underline">
              términos y condiciones
            </a>
          </label>
        </div>

        <PrimaryButton type="submit" loading={loading} disabled={!acceptTerms}>
          Crear cuenta
        </PrimaryButton>
      </form>

      <p className="text-center mt-6 text-[#6B7280]" style={{ fontSize: '14px' }}>
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-[#2563EB] hover:underline" style={{ fontWeight: '500' }}>
          Inicia sesión
        </Link>
      </p>
    </AuthCard>
  );
}
