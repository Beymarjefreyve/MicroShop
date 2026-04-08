import { AdminOrder } from '../../data/adminOrders';

interface OrderDrawerProps {
  order: AdminOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDrawer({ order, isOpen, onClose }: OrderDrawerProps) {
  if (!isOpen || !order) return null;

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

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10.00;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-[#1F2937] shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#111827] dark:text-white" style={{ fontSize: '20px', fontWeight: '600' }}>
              Detalle del pedido
            </h2>
            <button
              onClick={onClose}
              className="text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 dark:bg-[#111827] rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                  Número de pedido
                </p>
                <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px', fontWeight: '600' }}>
                  {order.id}
                </p>
              </div>
              <div>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                  Fecha
                </p>
                <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px' }}>
                  {new Date(order.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                  Estado
                </p>
                <span
                  className={`inline-block px-2 py-1 rounded-lg ${getStatusColor(order.status)} capitalize`}
                  style={{ fontSize: '12px', fontWeight: '500' }}
                >
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                  Método de pago
                </p>
                <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px' }}>
                  {order.paymentMethod === 'Nequi' ? '🅽 ' : '💳 '}
                  {order.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="text-[#111827] dark:text-white mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
              Información del cliente
            </h3>
            <div className="bg-gray-50 dark:bg-[#111827] rounded-xl p-4">
              <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px', fontWeight: '500' }}>
                {order.userName}
              </p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-1" style={{ fontSize: '14px' }}>
                {order.userEmail}
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="mb-6">
            <h3 className="text-[#111827] dark:text-white mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
              Productos
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-gray-50 dark:bg-[#111827] rounded-xl p-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-[#374151] rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px', fontWeight: '500' }}>
                      {item.name}
                    </p>
                    <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px', fontWeight: '600' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 dark:bg-[#111827] rounded-xl p-4 mb-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                  Subtotal
                </span>
                <span className="text-[#111827] dark:text-white" style={{ fontSize: '14px' }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                  Envío
                </span>
                <span className="text-[#111827] dark:text-white" style={{ fontSize: '14px' }}>
                  ${shipping.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                  IVA (19%)
                </span>
                <span className="text-[#111827] dark:text-white" style={{ fontSize: '14px' }}>
                  ${tax.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#374151] flex justify-between">
                <span className="text-[#111827] dark:text-white" style={{ fontSize: '16px', fontWeight: '600' }}>
                  Total
                </span>
                <span className="text-[#111827] dark:text-white" style={{ fontSize: '16px', fontWeight: '600' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-[#111827] dark:text-white mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
              Dirección de envío
            </h3>
            <div className="bg-gray-50 dark:bg-[#111827] rounded-xl p-4">
              <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px', fontWeight: '500' }}>
                {order.shippingAddress.name}
              </p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-1" style={{ fontSize: '14px' }}>
                {order.shippingAddress.address}
              </p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                {order.shippingAddress.city}
              </p>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mt-2" style={{ fontSize: '14px' }}>
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
