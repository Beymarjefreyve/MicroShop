import { AdminOrder } from '../../types/order';

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
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-[#1F2937] shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[#111827] dark:text-white mb-1" style={{ fontSize: '24px', fontWeight: '700' }}>
                Detalle del Pedido
              </h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                Gestiona y revisa los pormenores de la transacción
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-[#6B7280] dark:text-[#9CA3AF] transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status Banner */}
          <div className={`${getStatusColor(order.status)} rounded-2xl p-4 mb-8 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-bold uppercase tracking-wider" style={{ fontSize: '12px', opacity: 0.8 }}>Estado Actual</p>
                <p className="text-lg font-bold capitalize">{order.status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold uppercase tracking-wider" style={{ fontSize: '12px', opacity: 0.8 }}>Total del Pedido</p>
              <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
            </div>
          </div>

          {/* Grid Layout for Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-[#111827] rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-widest mb-4">Información General</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '11px' }}>ID DE PEDIDO</p>
                  <p className="text-[#111827] dark:text-white font-mono font-bold">#{order.id}</p>
                </div>
                <div>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '11px' }}>FECHA DE COMPRA</p>
                  <p className="text-[#111827] dark:text-white">
                    {new Date(order.date).toLocaleDateString('es-ES', {
                      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '11px' }}>MÉTODO DE PAGO</p>
                  <p className="text-[#111827] dark:text-white flex items-center gap-2">
                    <span className="text-lg">{order.paymentMethod === 'Nequi' ? '🅽' : '💳'}</span>
                    {order.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-[#111827] rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="text-sm font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-widest mb-4">Cliente</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] font-bold text-lg">
                  {order.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-[#111827] dark:text-white font-bold">{order.userName}</p>
                  <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '13px' }}>{order.userEmail}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '11px' }}>DIRECCIÓN DE ENVÍO</p>
                <p className="text-[#111827] dark:text-white text-sm mt-1">{order.shippingAddress.address}</p>
                <p className="text-[#6B7280] dark:text-[#9CA3AF] text-xs">{order.shippingAddress.city} • {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-widest mb-4 px-1">Productos en el Pedido</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-5 bg-white dark:bg-[#111827] rounded-2xl p-4 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-[#374151] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={item.image.startsWith('http') ? item.image : `${import.meta.env.VITE_CATALOG_URL || 'http://localhost:8002'}${item.image}`} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#111827] dark:text-white font-bold truncate" style={{ fontSize: '16px' }}>
                      {item.name}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '13px' }}>
                        Cantidad: <span className="font-bold text-[#111827] dark:text-white">{item.quantity}</span>
                      </p>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '13px' }}>
                        Precio Unit: <span className="font-bold text-[#111827] dark:text-white">${item.price.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#111827] dark:text-white font-bold" style={{ fontSize: '16px' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <span style={{ fontSize: '14px' }}>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span style={{ fontSize: '14px' }}>Gastos de Envío</span>
                <span className="text-white">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 pb-4 border-b border-white/10">
                <span style={{ fontSize: '14px' }}>Impuestos (IVA 19%)</span>
                <span className="text-white">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold">Total Final</span>
                <span className="text-3xl font-bold text-[#3B82F6]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
