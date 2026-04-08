import { useState } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminTable } from '../components/admin/AdminTable';
import { OrderDrawer } from '../components/admin/OrderDrawer';
import { adminOrders, AdminOrder } from '../data/adminOrders';

export function AdminOrders() {
  const [orders] = useState<AdminOrder[]>(adminOrders);
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;
    const matchesDateFrom = !dateFrom || order.date >= dateFrom;
    const matchesDateTo = !dateTo || order.date <= dateTo;
    return matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Usuario', 'Email', 'Total', 'Estado', 'Fecha'];
    const rows = filteredOrders.map((order) => [
      order.id,
      order.userName,
      order.userEmail,
      order.total.toFixed(2),
      order.status,
      order.date
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleRowClick = (order: AdminOrder) => {
    setSelectedOrder(order);
    setShowDrawer(true);
  };

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

  const columns = [
    { header: 'ID', accessor: 'id' as const, width: '12%' },
    { header: 'Usuario', accessor: 'userName' as const, width: '20%' },
    {
      header: 'Email',
      accessor: 'userEmail' as const,
      width: '25%'
    },
    {
      header: 'Total',
      accessor: (row: AdminOrder) => `$${row.total.toFixed(2)}`,
      width: '12%'
    },
    {
      header: 'Estado',
      accessor: (row: AdminOrder) => (
        <span
          className={`px-2 py-1 rounded-lg ${getStatusColor(row.status)} capitalize`}
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          {row.status}
        </span>
      ),
      width: '15%'
    },
    {
      header: 'Fecha',
      accessor: (row: AdminOrder) =>
        new Date(row.date).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      width: '16%'
    }
  ];

  return (
    <AdminLayout title="Pedidos">
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-[#6B7280] dark:text-[#9CA3AF] mb-2" style={{ fontSize: '12px' }}>
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#1F2937] border-2 border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              style={{ fontSize: '14px' }}
            >
              <option>Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-[#6B7280] dark:text-[#9CA3AF] mb-2" style={{ fontSize: '12px' }}>
              Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#1F2937] border-2 border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[#6B7280] dark:text-[#9CA3AF] mb-2" style={{ fontSize: '12px' }}>
              Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#1F2937] border-2 border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
              style={{ fontSize: '14px' }}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setStatusFilter('Todos');
              setDateFrom('');
              setDateTo('');
            }}
            className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Limpiar filtros
          </button>
          <button
            onClick={handleExportCSV}
            className="ml-auto px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            📥 Exportar CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-4" style={{ fontSize: '14px' }}>
          Mostrando {filteredOrders.length} de {orders.length} pedidos
        </p>
        <AdminTable data={filteredOrders} columns={columns} onRowClick={handleRowClick} />
      </div>

      {/* Drawer */}
      <OrderDrawer order={selectedOrder} isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
    </AdminLayout>
  );
}
