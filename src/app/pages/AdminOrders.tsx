import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminTable } from '../components/admin/AdminTable';
import { OrderDrawer } from '../components/admin/OrderDrawer';
import { orderService } from '../services/orderService';

import { AdminOrder } from '../types/order';

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [buyerFilter, setBuyerFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      const mappedOrders = data.map((o: any) => ({
        id: o.id.toString(),
        userName: `User ${o.user_id}`, // In a real app, join with auth-service or include name in payload
        userEmail: `user${o.user_id}@example.com`,
        total: Number(o.total_amount),
        status: o.status.toLowerCase() === 'procesando' ? 'en proceso' : o.status.toLowerCase(),
        date: o.created_at,
        estimatedDeliveryDate: o.estimated_delivery_date,
        shippingAddress: {
          name: `User ${o.user_id}`,
          address: o.shipping_address,
          city: 'Ciudad',
          phone: '000-000-0000'
        },
        paymentMethod: 'Tarjeta', // Mocked as order-service doesn't store this yet
        items: o.items.map((i: any) => ({
          name: i.product_name,
          quantity: i.quantity,
          price: Number(i.price_at_purchase)
        }))
      }));
      setOrders(mappedOrders);
    } catch (e) {
      console.error('Error fetching admin orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;
    const orderDate = order.date.split('T')[0];
    const matchesDateFrom = !dateFrom || orderDate >= dateFrom;
    const matchesDateTo = !dateTo || orderDate <= dateTo;
    const matchesBuyer = !buyerFilter || 
      order.userName.toLowerCase().includes(buyerFilter.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(buyerFilter.toLowerCase());
    const matchesProduct = !productFilter || 
      order.items.some(item => item.name.toLowerCase().includes(productFilter.toLowerCase()));
      
    return matchesStatus && matchesDateFrom && matchesDateTo && matchesBuyer && matchesProduct;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Usuario', 'Email', 'Total', 'Estado', 'Fecha', 'Productos'];
    const rows = filteredOrders.map((order) => [
      order.id,
      order.userName,
      order.userEmail,
      order.total.toFixed(2),
      order.status,
      order.date,
      order.items.map(i => i.name).join(' | ')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pedidos_admin_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleRowClick = (order: any) => {
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
    { header: 'ID', accessor: 'id' as const, width: '10%' },
    { header: 'Comprador', accessor: 'userName' as const, width: '18%' },
    {
      header: 'Email',
      accessor: 'userEmail' as const,
      width: '20%'
    },
    {
      header: 'Productos',
      accessor: (row: any) => (
        <div className="truncate max-w-[200px]" title={row.items.map((i: any) => i.name).join(', ')}>
          {row.items.map((i: any) => i.name).join(', ')}
        </div>
      ),
      width: '20%'
    },
    {
      header: 'Total',
      accessor: (row: AdminOrder) => `$${row.total.toFixed(2)}`,
      width: '10%'
    },
    {
      header: 'Estado',
      accessor: (row: AdminOrder) => (
        <span
          className={`px-2 py-1 rounded-lg ${getStatusColor(row.status)} capitalize text-[11px] font-bold`}
        >
          {row.status}
        </span>
      ),
      width: '12%'
    },
    {
      header: 'Fecha',
      accessor: (row: AdminOrder) =>
        new Date(row.date).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
      width: '10%'
    }
  ];

  return (
    <AdminLayout title="Gestión de Pedidos">
      {/* Filters Card */}
      <div className="bg-white dark:bg-[#1F2937] p-6 rounded-2xl shadow-sm border border-[#E5E7EB] dark:border-[#374151] mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-[#6B7280] dark:text-[#9CA3AF] mb-2 font-medium" style={{ fontSize: '12px' }}>
              Comprador
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre o email..."
                value={buyerFilter}
                onChange={(e) => setBuyerFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-xl text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                style={{ fontSize: '13px' }}
              />
              <svg className="absolute left-3 top-2.5 text-[#9CA3AF]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-[#6B7280] dark:text-[#9CA3AF] mb-2 font-medium" style={{ fontSize: '12px' }}>
              Producto
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar en artículos..."
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#F9FAFB] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-xl text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                style={{ fontSize: '13px' }}
              />
              <svg className="absolute left-3 top-2.5 text-[#9CA3AF]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-[#6B7280] dark:text-[#9CA3AF] mb-2 font-medium" style={{ fontSize: '12px' }}>
              Estado
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-[#F9FAFB] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-xl text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all appearance-none"
              style={{ fontSize: '13px' }}
            >
              <option>Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en proceso">En proceso</option>
              <option value="entregado">Entregado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-[#6B7280] dark:text-[#9CA3AF] mb-2 font-medium" style={{ fontSize: '12px' }}>
              Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 bg-[#F9FAFB] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-xl text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
              style={{ fontSize: '13px' }}
            />
          </div>

          <div>
            <label className="block text-[#6B7280] dark:text-[#9CA3AF] mb-2 font-medium" style={{ fontSize: '12px' }}>
              Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 bg-[#F9FAFB] dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] rounded-xl text-[#111827] dark:text-white focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
              style={{ fontSize: '13px' }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6] dark:border-[#374151]">
          <button
            onClick={() => {
              setStatusFilter('Todos');
              setDateFrom('');
              setDateTo('');
              setBuyerFilter('');
              setProductFilter('');
            }}
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#EF4444] transition-colors font-medium"
            style={{ fontSize: '13px' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Limpiar filtros
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-5 py-2 bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#374151] text-[#111827] dark:text-white rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm"
              style={{ fontSize: '13px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Exportar Reporte
            </button>
          </div>
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
