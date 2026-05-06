import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useCart } from '../../hooks/useCart';
import authService from '../../services/authService';

export function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();
  
  const location = useLocation();
  const user = authService.getUser();
  const roles = user?.roles || [];
  const activeRole = localStorage.getItem('activeRole');
  
  // Detección inteligente basada en URL o rol guardado
  const isSellerMode = activeRole === 'SELLER' || location.pathname.startsWith('/seller');
  const isAdminMode = activeRole === 'ADMIN' || location.pathname.startsWith('/admin');
  const isBuyerMode = activeRole === 'BUYER' || (!isSellerMode && !isAdminMode) || location.pathname.startsWith('/catalog') || location.pathname.startsWith('/orders') || location.pathname.startsWith('/cart');
  
  const isSeller = isSellerMode;
  const isAdmin = isAdminMode;
  const isBuyer = isBuyerMode;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-[#E5E7EB] shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/catalog" className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className="text-xl text-[#2563EB]" style={{ fontWeight: '700' }}>
              MicroShop
            </span>
          </Link>

          {/* Spacer para centrar el buscador en desktop */}
          <div className="hidden md:block flex-1" />

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Cart - Only for Buyers */}
            {isBuyer && !isSeller && (
              <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full" style={{ fontSize: '11px', fontWeight: '600' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Orders - Only for Buyers */}
            {isBuyer && !isSeller && (
              <Link to="/orders" className="p-2 hover:bg-gray-50 rounded-lg transition-colors" title="Mis pedidos">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </Link>
            )}

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#111827"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E5E7EB] py-1 z-20">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-[#111827] hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mi perfil
                    </Link>
                    {isBuyer && !isSeller && (
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-[#111827] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mis pedidos
                      </Link>
                    )}
                    {isSeller && (
                      <Link
                        to="/seller/products"
                        className="block px-4 py-2 text-[#111827] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Mis productos
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-[#2563EB] hover:bg-gray-50 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                        style={{ fontWeight: '500' }}
                      >
                        🔧 Panel Admin
                      </Link>
                    )}
                    <hr className="my-1 border-[#E5E7EB]" />
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Cerrar sesión
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}