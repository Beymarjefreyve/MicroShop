import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Usuarios', icon: '👥' },
    { path: '/admin/orders', label: 'Pedidos', icon: '📦' },
    { path: '/admin/incidents', label: 'Incidencias', icon: '⚠️' },
    { path: '/admin/inventory', label: 'Inventario', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#111827]">
      {/* Sidebar Desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-60 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-[#1F2937] border-r border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center flex-shrink-0 px-4">
            <a href="http://localhost:3000/" className="text-xl text-[#111827] dark:text-white" style={{ fontWeight: '600' }}>
              MicroShop Admin
            </a>
          </div>
          <div className="mt-8 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'text-[#6B7280] dark:text-[#9CA3AF] hover:bg-gray-50 dark:hover:bg-[#374151]'
                    }`}
                    style={{ fontSize: '14px', fontWeight: '500' }}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:pl-60 flex flex-col flex-1">
        {/* Header */}
        <header className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-[#1F2937] border-b border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex-1 px-4 flex justify-between items-center">
            <h1 className="text-[#111827] dark:text-white" style={{ fontSize: '20px', fontWeight: '600' }}>
              {title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#DBEAFE] dark:bg-[#1E40AF] text-[#1E40AF] dark:text-white rounded-lg" style={{ fontSize: '12px', fontWeight: '500' }}>
                Administrador
              </span>
              <a
                href="http://localhost:3000/"
                className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors"
                style={{ fontSize: '14px' }}
              >
                Volver a la tienda
              </a>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
