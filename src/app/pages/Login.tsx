import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import { InputField } from '../components/auth/InputField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PrimaryButton } from '../components/auth/PrimaryButton';

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = '';

    if (name === 'email') {
      if (!value) error = 'El correo electrónico es requerido';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Correo electrónico inválido';
    } else if (name === 'password') {
      if (!value) error = 'La contraseña es requerida';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof typeof formData]);
    });

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/profile');
    }, 1500);
  };

  return (
    <AuthCard>
      <h2 className="text-center text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
        Bienvenido de nuevo
      </h2>
      <p className="text-center text-[#6B7280] mb-6" style={{ fontSize: '14px' }}>
        Inicia sesión para continuar
      </p>

      <form onSubmit={handleSubmit}>
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

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 border-[#D1D5DB] rounded accent-[#2563EB] cursor-pointer"
            />
            <label htmlFor="remember" className="text-[#6B7280] cursor-pointer" style={{ fontSize: '14px' }}>
              Recordarme
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-[#2563EB] hover:underline"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <PrimaryButton type="submit" loading={loading}>
          Iniciar sesión
        </PrimaryButton>
      </form>

      <p className="text-center mt-6 text-[#6B7280]" style={{ fontSize: '14px' }}>
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-[#2563EB] hover:underline" style={{ fontWeight: '500' }}>
          Regístrate
        </Link>
      </p>
    </AuthCard>
  );
}
