import { useNavigate } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';
import authService from '../services/authService';
import { useEffect, useState } from 'react';

export function SelectRole() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setRoles(user.roles || []);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const handleRoleSelect = (role: string) => {
    if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role === 'SELLER') {
      navigate('/seller/products');
    } else {
      navigate('/catalog');
    }
  };

  return (
    <AuthCard>
      <h2 className="text-center text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
        Selecciona un perfil
      </h2>
      <p className="text-center text-[#6B7280] mb-8" style={{ fontSize: '14px' }}>
        Tu cuenta tiene múltiples roles. Elige cómo deseas ingresar hoy.
      </p>

      <div className="flex flex-col gap-4">
        {roles.includes('BUYER') && (
          <button
            onClick={() => handleRoleSelect('BUYER')}
            className="w-full p-4 flex items-center justify-between border-2 border-[#E5E7EB] rounded-xl hover:border-[#2563EB] hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#2563EB]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#111827]">Comprador</p>
                <p className="text-xs text-[#6B7280]">Explora productos y realiza compras</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9CA3AF] group-hover:text-[#2563EB]">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {roles.includes('SELLER') && (
          <button
            onClick={() => handleRoleSelect('SELLER')}
            className="w-full p-4 flex items-center justify-between border-2 border-[#E5E7EB] rounded-xl hover:border-[#2563EB] hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                  <path d="M2 7h20" />
                  <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#111827]">Vendedor</p>
                <p className="text-xs text-[#6B7280]">Gestiona tus productos y ventas</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9CA3AF] group-hover:text-[#2563EB]">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {roles.includes('ADMIN') && (
          <button
            onClick={() => handleRoleSelect('ADMIN')}
            className="w-full p-4 flex items-center justify-between border-2 border-[#E5E7EB] rounded-xl hover:border-[#2563EB] hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#111827]">Administrador</p>
                <p className="text-xs text-[#6B7280]">Panel de control del sistema</p>
              </div>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#9CA3AF] group-hover:text-[#2563EB]">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}
      </div>

      <button
        onClick={() => {
          authService.clearAuthData();
          navigate('/login');
        }}
        className="w-full mt-8 text-[#6B7280] text-sm hover:text-[#2563EB] transition-colors"
      >
        Cerrar sesión
      </button>
    </AuthCard>
  );
}
