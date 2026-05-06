import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { InputField } from '../components/auth/InputField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PrimaryButton } from '../components/auth/PrimaryButton';
import authService from '../services/authService';

export function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setApiError('');

    // For now, allow direct access as requested
    setTimeout(() => {
      // We still save some mock data to satisfy the app state if needed
      authService.saveAuthData('mock-admin-token', {
        id: 1,
        email: formData.email || 'admin@microshop.com',
        name: 'Admin Master',
        roles: ['ADMIN']
      });
      navigate('/admin/dashboard');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-[#111827] px-4">
      <div className="w-full max-w-[440px]">
        {/* Decorative Background Element */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#2563EB]"></div>
        
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl shadow-2xl overflow-hidden border border-[#E5E7EB] dark:border-[#374151]">
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-[#EEF2FF] dark:bg-[#312E81] rounded-2xl flex items-center justify-center mb-4">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#111827] dark:text-white text-center">
                Portal de Administración
              </h1>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-2 text-center text-sm">
                Inicie sesión con su cuenta maestra
              </p>
            </div>

            {apiError && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                label="Usuario Maestro / Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="admin@microshop.com"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
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

              <div className="pt-2">
                <PrimaryButton type="submit" loading={loading} className="w-full h-12 text-base shadow-lg shadow-blue-500/20">
                  Acceder al Panel
                </PrimaryButton>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50 dark:bg-[#374151]/30 px-8 py-4 border-t border-[#E5E7EB] dark:border-[#374151]">
            <p className="text-center text-xs text-[#9CA3AF] dark:text-[#6B7280]">
              Sistema de gestión interna. El acceso no autorizado está estrictamente prohibido.
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#2563EB] transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Volver al sitio público
          </button>
        </div>
      </div>
    </div>
  );
}
