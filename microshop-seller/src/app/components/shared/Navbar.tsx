import { useState } from 'react';
import { Link } from 'react-router';
import { useCart } from '../../hooks/useCart';

export function Navbar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-[#E5E7EB] shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="http://localhost:3000/catalog" className="flex items-center gap-2">
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
              MicroShop Seller
            </span>
          </a>

          {/* Spacer para centrar el buscador en desktop */}
          <div className="hidden md:block flex-1" />

          {/* Icons */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <a href="http://localhost:3000/cart" className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111827"
                strokeWidth="2"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2563EB] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full" style={{ fontSize: '11px', fontWeight: '600' }}>
                  {cartCount}
                </span>
              )}
            </a>

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
                    <a
                      href="http://localhost:3000/profile"
                      className="block px-4 py-2 text-[#111827] hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mi perfil
                    </a>
                    <a
                      href="http://localhost:3000/orders"
                      className="block px-4 py-2 text-[#111827] hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mis pedidos
                    </a>
                    <Link
                      to="/seller/products"
                      className="block px-4 py-2 text-[#111827] hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Mis productos
                    </Link>
                    <a
                      href="http://localhost:3002/admin/dashboard"
                      className="block px-4 py-2 text-[#2563EB] hover:bg-gray-50 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                      style={{ fontWeight: '500' }}
                    >
                      🔧 Panel Admin
                    </a>
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