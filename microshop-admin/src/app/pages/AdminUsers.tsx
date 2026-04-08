import { useState } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminTable } from '../components/admin/AdminTable';
import { adminUsers, AdminUser } from '../data/adminUsers';

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Todos');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'Todos' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' }
          : user
      )
    );
  };

  const handleEditRole = (user: AdminUser) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveRole = (newRole: 'Comprador' | 'Vendedor' | 'Admin') => {
    if (editingUser) {
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, role: newRole } : user
        )
      );
      setShowEditModal(false);
      setEditingUser(null);
    }
  };

  const roleColors: Record<string, string> = {
    Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    Vendedor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Comprador: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  };

  const columns = [
    { header: 'Nombre', accessor: 'name' as const, width: '20%' },
    { header: 'Email', accessor: 'email' as const, width: '25%' },
    {
      header: 'Rol',
      accessor: (row: AdminUser) => (
        <span
          className={`px-2 py-1 rounded-lg ${roleColors[row.role]}`}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {row.role}
        </span>
      ),
      width: '15%'
    },
    {
      header: 'Estado',
      accessor: (row: AdminUser) => (
        <span
          className={`px-2 py-1 rounded-lg ${
            row.status === 'Activo'
              ? 'bg-[#D1FAE5] text-[#065F46]'
              : 'bg-[#FEE2E2] text-[#991B1B]'
          }`}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {row.status}
        </span>
      ),
      width: '15%'
    },
    {
      header: 'Registro',
      accessor: (row: AdminUser) =>
        new Date(row.registrationDate).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      width: '15%'
    },
    {
      header: 'Acciones',
      accessor: (row: AdminUser) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditRole(row);
            }}
            className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Editar rol
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleStatus(row.id);
            }}
            className={`transition-colors ${
              row.status === 'Activo'
                ? 'text-red-600 hover:text-red-700'
                : 'text-green-600 hover:text-green-700'
            }`}
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            {row.status === 'Activo' ? 'Desactivar' : 'Activar'}
          </button>
        </div>
      ),
      width: '10%'
    }
  ];

  return (
    <AdminLayout title="Usuarios">
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-[#1F2937] border-2 border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition-colors"
            style={{ fontSize: '14px' }}
          />
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-[#1F2937] border-2 border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
            style={{ fontSize: '14px' }}
          >
            <option>Todos</option>
            <option>Comprador</option>
            <option>Vendedor</option>
            <option>Admin</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mb-4">
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-4" style={{ fontSize: '14px' }}>
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </p>
        <AdminTable data={filteredUsers} columns={columns} />
      </div>

      {/* Edit Role Modal */}
      {showEditModal && editingUser && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <div
              className="bg-white dark:bg-[#1F2937] rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[#111827] dark:text-white mb-4" style={{ fontSize: '20px', fontWeight: '600' }}>
                Editar rol de usuario
              </h2>
              <div className="mb-6">
                <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-4" style={{ fontSize: '14px' }}>
                  Usuario: <span className="text-[#111827] dark:text-white">{editingUser.name}</span>
                </p>
                <label className="block text-[#111827] dark:text-white mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                  Selecciona el nuevo rol
                </label>
                <div className="space-y-2">
                  {(['Comprador', 'Vendedor', 'Admin'] as const).map((role) => (
                    <button
                      key={role}
                      onClick={() => handleSaveRole(role)}
                      className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                        editingUser.role === role
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-gray-50 dark:bg-[#111827] text-[#111827] dark:text-white hover:bg-gray-100 dark:hover:bg-[#374151]'
                      }`}
                      style={{ fontSize: '14px', fontWeight: '500' }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-full px-6 py-2.5 border-2 border-[#E5E7EB] dark:border-[#374151] text-[#6B7280] dark:text-[#9CA3AF] rounded-lg hover:bg-gray-50 dark:hover:bg-[#374151] transition-colors"
                style={{ fontSize: '14px', fontWeight: '500' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
