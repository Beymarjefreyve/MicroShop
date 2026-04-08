import { Link } from 'react-router';
import { AuthCard } from '../components/auth/AuthCard';

export function Register() {
  return (
    <AuthCard>
      <h2 className="text-center text-[#111827] mb-2" style={{ fontSize: '24px', fontWeight: '600' }}>
        Registro Restringido
      </h2>
      <p className="text-center text-[#6B7280] mb-8" style={{ fontSize: '14px' }}>
        El registro público de administradores no está permitido por motivos de seguridad.
      </p>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <svg 
          className="w-12 h-12 text-amber-500 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-amber-800 font-medium mb-2">Acceso Reservado</p>
        <p className="text-amber-700 text-sm">
          Si eres el dueño de la plataforma o necesitas una cuenta administrativa, por favor contacta con el equipo de infraestructura o usa los scripts de inicialización de base de datos.
        </p>
      </div>

      <p className="text-center mt-8 text-[#6B7280]" style={{ fontSize: '14px' }}>
        ¿Ya tienes una cuenta administrativa?{' '}
        <Link to="/login" className="text-[#2563EB] hover:underline" style={{ fontWeight: '500' }}>
          Inicia sesión aquí
        </Link>
      </p>

      <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
        <p className="text-xs text-gray-400 text-center uppercase tracking-wider font-semibold">Otras plataformas</p>
        <div className="grid grid-cols-2 gap-3">
          <a 
            href="http://localhost:3000/register" 
            className="text-center py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
          >
            Portal Comprador
          </a>
          <a 
            href="http://localhost:3001/register" 
            className="text-center py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-600 transition-colors"
          >
            Portal Vendedor
          </a>
        </div>
      </div>
    </AuthCard>
  );
}
