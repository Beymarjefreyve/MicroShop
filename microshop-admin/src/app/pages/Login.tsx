import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import { InputField } from '../components/auth/InputField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PrimaryButton } from '../components/auth/PrimaryButton';

import authService from '../services/authService';

// Utility to decode JWT token
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

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
    setApiError('');
  };

  const handleRoleRedirection = (role: string) => {
    // Correct mapping for redirection
    const mappedRole = authService.mapRole(role);
    
    // Current microfrontend ports
    const rolePorts: Record<string, string> = {
      buyer: '3000',
      seller: '3001',
      admin: '3002'
    };
    
    const port = rolePorts[mappedRole];
    if (port) {
      if (window.location.port !== port) {
        window.location.href = `http://localhost:${port}/`;
      } else {
        // Redirection inside the same app
        if (mappedRole === 'admin') navigate('/admin/dashboard');
        else if (mappedRole === 'seller') navigate('/seller/products');
        else navigate('/catalog');
      }
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    Object.keys(formData).forEach(key => {
      validateField(key, formData[key as keyof typeof formData]);
    });

    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) return;

    setLoading(true);
    setApiError('');

    try {
      const data = await authService.login(formData);
      
      if (data.token) {
        const decoded = parseJwt(data.token);
        authService.saveAuthData(data.token, {
          name: data.name,
          email: data.email,
          role: decoded?.role || data.role
        });
        
        const userRole = decoded?.role || data.role;
        if (userRole) {
          handleRoleRedirection(userRole);
        } else {
          navigate('/');
        }
      } else {
        throw new Error('No se recibió el token de autenticación');
      }
    } catch (error: any) {
      setApiError(error.message || 'Error en inicio de sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <h2 className="text-center text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
        Bienvenido de nuevo
      </h2>
      <p className="text-center text-[#6B7280] mb-6" style={{ fontSize: '14px' }}>
        Inicia sesión para continuar
      </p>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
          {apiError}
        </div>
      )}

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
