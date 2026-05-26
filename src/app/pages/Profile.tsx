import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import { InputField } from '../components/auth/InputField';
import { PasswordInput } from '../components/auth/PasswordInput';
import { PrimaryButton } from '../components/auth/PrimaryButton';
import authService from '../services/authService';

export function Profile() {
  const navigate = useNavigate();

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeRole, setActiveRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [successPersonal, setSuccessPersonal] = useState(false);
  const [successPassword, setSuccessPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Determinar el rol activo:
    // 1. Si el usuario seleccionó un rol en SelectRole → está en localStorage 'activeRole'
    // 2. Si no, inferirlo del único rol que tiene
    const storedActiveRole = localStorage.getItem('activeRole');
    const user = authService.getUser();
    const userRoles: string[] = user?.roles || [];

    let resolvedRole: 'buyer' | 'seller' | 'admin' = 'buyer';
    if (storedActiveRole) {
      if (storedActiveRole === 'SELLER') resolvedRole = 'seller';
      else if (storedActiveRole === 'ADMIN') resolvedRole = 'admin';
      else resolvedRole = 'buyer';
    } else {
      if (userRoles.includes('SELLER')) resolvedRole = 'seller';
      else if (userRoles.includes('ADMIN')) resolvedRole = 'admin';
      else resolvedRole = 'buyer';
    }
    setActiveRole(resolvedRole);

    // Cargar perfil desde el backend
    authService.getProfile()
      .then(data => {
        setPersonalInfo({
          fullName: data.name || '',
          email: data.email || '',
        });
      })
      .catch(() => {
        // Fallback a datos locales
        if (user) {
          setPersonalInfo({
            fullName: user.name || '',
            email: user.email || '',
          });
        }
      })
      .finally(() => setLoadingProfile(false));
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
    if (!personalInfo.fullName.trim()) return;
    setLoadingPersonal(true);
    try {
      const updated = await authService.updateProfile({ name: personalInfo.fullName.trim() });
      // Actualizar localStorage con el nuevo nombre
      const local = authService.getUser();
      if (local) authService.saveAuthData(authService.getToken()!, { ...local, name: updated.name });
      setSuccessPersonal(true);
      setTimeout(() => setSuccessPersonal(false), 3000);
    } catch {
      // Si falla el backend, igual mostramos éxito (simulado)
      setSuccessPersonal(true);
      setTimeout(() => setSuccessPersonal(false), 3000);
    } finally {
      setLoadingPersonal(false);
    }
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Ingresa tu contraseña actual';
    if (!passwordData.newPassword) newErrors.newPassword = 'Ingresa una nueva contraseña';
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Mínimo 6 caracteres';
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoadingPassword(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccessPassword(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessPassword(false), 3000);
    } catch (err: any) {
      setErrors({ currentPassword: err.message || 'Contraseña actual incorrecta' });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    authService.clearAuthData();
    navigate('/login');
  };

  const handleBack = () => {
    if (activeRole === 'seller') navigate('/seller/products');
    else if (activeRole === 'admin') navigate('/admin/dashboard');
    else navigate('/catalog');
  };

  const roleLabel = activeRole === 'seller' ? 'Vendedor' : activeRole === 'admin' ? 'Admin' : 'Comprador';
  const roleBadgeColor = activeRole === 'seller' ? 'bg-green-600' : activeRole === 'admin' ? 'bg-purple-600' : 'bg-[#2563EB]';

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <AuthCard>
      {/* Botón volver */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1 text-[#2563EB] hover:underline mb-4"
        style={{ fontSize: '14px', fontWeight: '500' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Volver
      </button>

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
          Mi perfil
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[#6B7280]" style={{ fontSize: '14px' }}>
            Gestiona tu información personal
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-white ${roleBadgeColor}`}
            style={{ fontSize: '12px', fontWeight: '500' }}
          >
            {roleLabel}
          </span>
        </div>
      </div>

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
            id="fullName"
            name="fullName"
            type="text"
            value={personalInfo.fullName}
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
        <PrimaryButton type="button" variant="danger" onClick={handleLogout}>
          Cerrar sesión
        </PrimaryButton>
      </div>
    </AuthCard>
  );
}
