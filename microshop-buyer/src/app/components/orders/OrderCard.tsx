import { Link } from 'react-router';
import { Order } from '../../data/orders';
import { OrderStatusBadge } from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: string) => void;
}

export function OrderCard({ order, onCancel }: OrderCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="text-[#111827]" style={{ fontSize: '16px', fontWeight: '700' }}>
              #{order.id}
            </p>
            <p className="text-[#6B7280] mt-1" style={{ fontSize: '14px' }}>
              {formatDate(order.date)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Payment method */}
        <div className="flex items-center gap-2 text-[#6B7280]" style={{ fontSize: '14px' }}>
          {order.paymentMethod === 'Nequi' ? (
            <>
              <span className="w-6 h-6 bg-[#2563EB] text-white rounded flex items-center justify-center" style={{ fontSize: '12px', fontWeight: '700' }}>
                N
              </span>
              <span>Nequi</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              <span>Tarjeta</span>
            </>
          )}
        </div>

        {/* Summary */}
        <p className="text-[#6B7280]" style={{ fontSize: '14px' }}>
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'} · ${order.total.toFixed(2)} total
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#E5E7EB]">
          <Link
            to={`/orders/${order.id}`}
            className="flex-1 py-2.5 px-4 text-center bg-white text-[#2563EB] border-2 border-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Ver detalle
          </Link>
          {(order.status === 'pendiente' || order.status === 'en proceso') && onCancel && (
            <button
              onClick={() => onCancel(order.id)}
              className="py-2.5 px-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              Cancelar pedido
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
