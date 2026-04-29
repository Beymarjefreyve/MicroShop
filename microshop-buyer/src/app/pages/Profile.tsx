import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import { InputField } from '../components/auth/InputField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PrimaryButton } from '../components/auth/PrimaryButton';

import authService from '../services/authService';

export function Profile() {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: '' // Note: Phone is not currently in backend DTO, but we keep the field for UI
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [successPersonal, setSuccessPersonal] = useState(false);
  const [successPassword, setSuccessPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await authService.getProfile();
        setPersonalInfo({
          name: data.name,
          email: data.email,
          phone: '' // Backend doesn't return phone yet
        });
        setUserRole(authService.mapRole(data.role));
      } catch (err: any) {
        setApiError(err.message || 'Error al cargar perfil');
      }
    };

    fetchProfile();
  }, [navigate]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePersonalInfoSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoadingPersonal(true);
    setApiError('');

    try {
      await authService.updateProfile({ name: personalInfo.name });
      setSuccessPersonal(true);
      setTimeout(() => setSuccessPersonal(false), 3000);
    } catch (err: any) {
      setApiError(err.message || 'Error al actualizar perfil');
    } finally {
      setLoadingPersonal(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors: Record<string, string> = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Ingresa tu contraseña actual';
      hasErrors = true;
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Ingresa una nueva contraseña';
      hasErrors = true;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Mínimo 6 caracteres';
      hasErrors = true;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      hasErrors = true;
    }

    setErrors(newErrors);
    if (hasErrors) return;

    setLoadingPassword(true);
    setApiError('');

    try {
      await authService.changePassword({
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccessPassword(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessPassword(false), 3000);
    } catch (err: any) {
      setApiError(err.message || 'Error al cambiar contraseña');
    } finally {
      setLoadingPassword(false);
    }

  };


  const handleLogout = () => {
    authService.clearAuthData();
    navigate('/login');
  };

  return (
    <AuthCard>
      <div className="mb-6">
        <h2 className="text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
          Mi perfil
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[#6B7280]" style={{ fontSize: '14px' }}>
            Gestiona tu información personal
          </span>
          {userRole && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-white ${
                userRole === 'buyer' ? 'bg-[#2563EB]' : userRole === 'seller' ? 'bg-green-600' : 'bg-purple-600'
              }`}
              style={{ fontSize: '12px', fontWeight: '500' }}
            >
              {userRole === 'buyer' ? 'Comprador' : userRole === 'seller' ? 'Vendedor' : 'Administrador'}
            </span>
          )}
        </div>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm text-center">
          {apiError}
        </div>
      )}

      {/* Información Personal */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h3 className="text-[#111827]" style={{ fontSize: '18px', fontWeight: '600' }}>
            Información personal
          </h3>
        </div>

        {successPersonal && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800" style={{ fontSize: '13px' }}>
              ✓ Información actualizada correctamente
            </p>
          </div>
        )}

        <form onSubmit={handlePersonalInfoSubmit}>
          <InputField
            label="Nombre completo"
            id="name"
            name="name"
            type="text"
            value={personalInfo.name}
            onChange={handlePersonalInfoChange}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />

          <div className="mb-4">
            <label className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                type="email"
                value={personalInfo.email}
                disabled
                className="w-full px-4 py-2.5 pl-10 pr-20 border border-[#D1D5DB] rounded-lg bg-gray-50 text-[#6B7280]"
                style={{ fontSize: '14px' }}
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-green-100 text-green-700 rounded"
                style={{ fontSize: '11px', fontWeight: '500' }}
              >
                ✓ Verificado
              </span>
            </div>
          </div>

          <InputField
            label="Teléfono (opcional)"
            id="phone"
            name="phone"
            type="tel"
            value={personalInfo.phone}
            onChange={handlePersonalInfoChange}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            }
          />

          <PrimaryButton type="submit" loading={loadingPersonal}>
            Guardar cambios
          </PrimaryButton>
        </form>
      </div>

      {/* Seguridad */}
      <div className="mb-6 pt-6 border-t border-[#E5E7EB]">
        <div className="flex items-center gap-2 mb-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <h3 className="text-[#111827]" style={{ fontSize: '18px', fontWeight: '600' }}>
            Seguridad
          </h3>
        </div>

        {successPassword && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800" style={{ fontSize: '13px' }}>
              ✓ Contraseña actualizada correctamente
            </p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit}>
          <PasswordInput
            label="Contraseña actual"
            id="currentPassword"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            error={errors.currentPassword}
            placeholder="••••••••"
          />

          <PasswordInput
            label="Nueva contraseña"
            id="newPassword"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            error={errors.newPassword}
            placeholder="••••••••"
          />

          <PasswordInput
            label="Confirmar nueva contraseña"
            id="confirmPassword"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
          />

          <PrimaryButton type="submit" loading={loadingPassword}>
            Cambiar contraseña
          </PrimaryButton>
        </form>
      </div>

      {/* Cerrar sesión */}
      <div className="pt-6 border-t border-[#E5E7EB]">
        <PrimaryButton
          type="button"
          variant="danger"
          onClick={handleLogout}
        >
          Cerrar sesión
        </PrimaryButton>
      </div>
    </AuthCard>
  );
}
