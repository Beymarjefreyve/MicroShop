interface OrderStatusBadgeProps {
  status: 'entregado' | 'en proceso' | 'pendiente' | 'cancelado';
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig = {
    pendiente: {
      bg: '#FEF3C7',
      text: '#92400E',
      label: 'Pendiente',
    },
    'en proceso': {
      bg: '#DBEAFE',
      text: '#1E40AF',
      label: 'En proceso',
    },
    entregado: {
      bg: '#D1FAE5',
      text: '#065F46',
      label: 'Entregado',
    },
    cancelado: {
      bg: '#FEE2E2',
      text: '#991B1B',
      label: 'Cancelado',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className="px-3 py-1 rounded-full"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        fontSize: '13px',
        fontWeight: '500',
      }}
    >
      {config.label}
    </span>
  );
}
