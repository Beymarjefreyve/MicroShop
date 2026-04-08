import { useState, useMemo } from 'react';
import { Navbar } from '../components/shared/Navbar';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderFilters } from '../components/orders/OrderFilters';
import { CancelModal } from '../components/orders/CancelModal';
import { Toast } from '../components/orders/Toast';
import { mockOrders } from '../data/orders';

export function Orders() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (selectedStatus !== 'todos' && order.status !== selectedStatus) {
        return false;
      }

      // Date filter
      if (dateFrom && order.date < dateFrom) {
        return false;
      }
      if (dateTo && order.date > dateTo) {
        return false;
      }

      return true;
    });
  }, [orders, selectedStatus, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setSelectedStatus('todos');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const handleCancelClick = (orderId: string) => {
    setOrderToCancel(orderId);
    setCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    if (orderToCancel) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderToCancel ? { ...order, status: 'cancelado' as const } : order
        )
      );
      setToastMessage('Pedido cancelado correctamente');
      setToastVisible(true);
    }
    setCancelModalOpen(false);
    setOrderToCancel(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-[#111827] mb-6" style={{ fontSize: '28px', fontWeight: '700' }}>
          Mis pedidos ({filteredOrders.length})
        </h1>

        {/* Filters */}
        <div className="mb-6">
          <OrderFilters
            selectedStatus={selectedStatus}
            onStatusChange={(status) => {
              setSelectedStatus(status);
              setCurrentPage(1);
            }}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Orders list */}
        {paginatedOrders.length > 0 ? (
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onCancel={handleCancelClick}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-12 text-center shadow-md">
            <svg
              className="mx-auto mb-4"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="2"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
            <p className="text-[#6B7280]" style={{ fontSize: '16px' }}>
              No tienes pedidos en este estado
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? 'bg-[#2563EB] text-white'
                    : 'border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50'
                }`}
                style={{ fontSize: '14px', fontWeight: '500' }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modals and toasts */}
      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        orderId={orderToCancel || ''}
      />
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
        type="success"
      />
    </div>
  );
}
