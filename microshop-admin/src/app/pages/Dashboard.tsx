import { AdminLayout } from '../components/admin/AdminLayout';
import { StatCard } from '../components/admin/StatCard';
import { SalesChart } from '../components/admin/SalesChart';
import { AdminTable } from '../components/admin/AdminTable';
import { adminOrders } from '../data/adminOrders';
import { adminUsers } from '../data/adminUsers';

export function Dashboard() {
  const salesData = [
    { month: 'Nov', sales: 12450 },
    { month: 'Dic', sales: 18900 },
    { month: 'Ene', sales: 15680 },
    { month: 'Feb', sales: 21340 },
    { month: 'Mar', sales: 19870 },
    { month: 'Abr', sales: 24590 }
  ];

  const totalSales = salesData.reduce((sum, data) => sum + data.sales, 0);
  const totalOrders = adminOrders.length;
  const totalUsers = adminUsers.length;
  const totalIncidents = 6;

  const recentOrders = adminOrders.slice(0, 5);
  const recentUsers = adminUsers.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-[#FEF3C7] text-[#92400E]';
      case 'en proceso':
        return 'bg-[#DBEAFE] text-[#1E40AF]';
      case 'entregado':
        return 'bg-[#D1FAE5] text-[#065F46]';
      case 'cancelado':
        return 'bg-[#FEE2E2] text-[#991B1B]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const orderColumns = [
    { header: 'ID', accessor: 'id' as const, width: '15%' },
    { header: 'Cliente', accessor: 'userName' as const, width: '25%' },
    {
      header: 'Estado',
      accessor: (row: typeof recentOrders[0]) => (
        <span
          className={`px-2 py-1 rounded-lg ${getStatusColor(row.status)} capitalize`}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {row.status}
        </span>
      ),
      width: '20%'
    },
    {
      header: 'Total',
      accessor: (row: typeof recentOrders[0]) => `$${row.total.toFixed(2)}`,
      width: '15%'
    },
    {
      header: 'Fecha',
      accessor: (row: typeof recentOrders[0]) =>
        new Date(row.date).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      width: '25%'
    }
  ];

  const userColumns = [
    { header: 'Nombre', accessor: 'name' as const, width: '30%' },
    { header: 'Email', accessor: 'email' as const, width: '35%' },
    {
      header: 'Rol',
      accessor: (row: typeof recentUsers[0]) => {
        const roleColors: Record<string, string> = {
          Admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
          Vendedor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          Comprador: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        };
        return (
          <span
            className={`px-2 py-1 rounded-lg ${roleColors[row.role]}`}
            style={{ fontSize: '12px', fontWeight: '500' }}
          >
            {row.role}
          </span>
        );
      },
      width: '20%'
    },
    {
      header: 'Registro',
      accessor: (row: typeof recentUsers[0]) =>
        new Date(row.registrationDate).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      width: '15%'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Ventas totales"
          value={`$${totalSales.toLocaleString()}`}
          icon="💰"
          trend={{ value: '12.5%', isPositive: true }}
        />
        <StatCard
          title="Pedidos"
          value={totalOrders}
          icon="📦"
          trend={{ value: '8.2%', isPositive: true }}
        />
        <StatCard
          title="Usuarios"
          value={totalUsers}
          icon="👥"
          trend={{ value: '15.3%', isPositive: true }}
        />
        <StatCard
          title="Incidencias"
          value={totalIncidents}
          icon="⚠️"
          trend={{ value: '3.1%', isPositive: false }}
        />
      </div>

      {/* Sales Chart */}
      <div className="mb-8">
        <SalesChart data={salesData} />
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#111827] dark:text-white" style={{ fontSize: '18px', fontWeight: '600' }}>
            Últimos pedidos
          </h2>
          <a
            href="/admin/orders"
            className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Ver todos →
          </a>
        </div>
        <AdminTable data={recentOrders} columns={orderColumns} />
      </div>

      {/* Recent Users */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#111827] dark:text-white" style={{ fontSize: '18px', fontWeight: '600' }}>
            Usuarios recientes
          </h2>
          <a
            href="/admin/users"
            className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Ver todos →
          </a>
        </div>
        <AdminTable data={recentUsers} columns={userColumns} />
      </div>
    </AdminLayout>
  );
}
