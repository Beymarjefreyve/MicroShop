interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
    pendiente: {
      bg: '#FEF3C7',
      text: '#92400E',
      label: 'Pendiente de pago',
      icon: '⏳',
    },
    procesando: {
      bg: '#DBEAFE',
      text: '#1E40AF',
      label: 'Procesando',
      icon: '🔄',
    },
    pagado: {
      bg: '#D1FAE5',
      text: '#065F46',
      label: 'Pagado',
      icon: '✅',
    },
    enviado: {
      bg: '#E0E7FF',
      text: '#3730A3',
      label: 'Enviado',
      icon: '🚚',
    },
    entregado: {
      bg: '#D1FAE5',
      text: '#065F46',
      label: 'Entregado',
      icon: '📦',
    },
    cancelado: {
      bg: '#FEE2E2',
      text: '#991B1B',
      label: 'Cancelado',
      icon: '❌',
    },
    'en proceso': {
      bg: '#DBEAFE',
      text: '#1E40AF',
      label: 'En proceso',
      icon: '🔄',
    },
  };

  const config = statusConfig[status] || {
    bg: '#F3F4F6',
    text: '#6B7280',
    label: status,
    icon: '•',
  };

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
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
}
