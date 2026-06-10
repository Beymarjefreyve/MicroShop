import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { StatCard } from '../components/admin/StatCard';
import { SalesChart } from '../components/admin/SalesChart';
import { AdminTable } from '../components/admin/AdminTable';
import authService from '../services/authService';
import { orderService } from '../services/orderService';
import { formatCOP } from '../utils/format';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalIncidents: 0
  });
  const [salesData, setSalesData] = useState<{ month: string; sales: number }[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Fetch all orders
        const orders = await orderService.getAllOrders();
        // Fetch all users
        const users = await authService.getAllUsers();
        // Fetch all incidents
        const incidents = await orderService.getIncidents();

        // Calculate stats
        const activeOrders = orders.filter(o => o.status !== 'CANCELADO');
        const calculatedTotalSales = activeOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);

        // Group sales by month (last 6 months)
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const last6Months: { month: string; key: string; sales: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          last6Months.push({
            month: monthNames[d.getMonth()],
            key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
            sales: 0
          });
        }

        orders.forEach(o => {
          if (o.status !== 'CANCELADO' && o.created_at) {
            const dateStr = o.created_at.split('T')[0];
            const [year, month] = dateStr.split('-');
            const key = `${year}-${month}`;
            const targetMonth = last6Months.find(m => m.key === key);
            if (targetMonth) {
              targetMonth.sales += Number(o.total_amount);
            }
          }
        });

        const formattedSalesData = last6Months.map(m => ({ month: m.month, sales: m.sales }));

        // Map recent orders (first 5 sorted by date desc)
        const mappedRecentOrders = orders
          .slice()
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map(o => ({
            id: o.id.toString(),
            userName: o.user_name || `User ${o.user_id}`,
            status: o.status.toLowerCase() === 'procesando' ? 'en proceso' : o.status.toLowerCase(),
            total: Number(o.total_amount),
            date: o.created_at
          }));

        // Map recent users (first 5 sorted by id desc)
        const mappedRecentUsers = users
          .slice()
          .sort((a, b) => b.id - a.id)
          .slice(0, 5)
          .map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.roles && u.roles.includes('ADMIN') ? 'Admin' : (u.roles && u.roles.includes('SELLER') ? 'Vendedor' : 'Comprador'),
            registrationDate: u.createdAt || new Date().toISOString()
          }));

        setStats({
          totalSales: calculatedTotalSales,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalIncidents: incidents.length
        });
        setSalesData(formattedSalesData);
        setRecentOrders(mappedRecentOrders);
        setRecentUsers(mappedRecentUsers);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

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
      accessor: (row: any) => (
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
      accessor: (row: any) => formatCOP(row.total),
      width: '15%'
    },
    {
      header: 'Fecha',
      accessor: (row: any) =>
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
      accessor: (row: any) => {
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
      accessor: (row: any) =>
        new Date(row.registrationDate).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      width: '15%'
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Ventas totales"
          value={formatCOP(stats.totalSales)}
          icon="💰"
        />
        <StatCard
          title="Pedidos"
          value={stats.totalOrders}
          icon="📦"
        />
        <StatCard
          title="Usuarios"
          value={stats.totalUsers}
          icon="👥"
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

