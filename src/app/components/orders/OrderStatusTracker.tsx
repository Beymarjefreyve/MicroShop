interface OrderStatusTrackerProps {
  currentStatus: string;
  history: { status: string; date: string; comment?: string }[];
}

const FLOW = [
  { key: 'pendiente',  label: 'Pendiente',  icon: '🕐' },
  { key: 'pagado',     label: 'Pagado',     icon: '✅' },
  { key: 'procesando', label: 'Procesando', icon: '🔄' },
  { key: 'enviado',    label: 'Enviado',    icon: '🚚' },
  { key: 'entregado',  label: 'Entregado',  icon: '📦' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  pendiente:  { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  pagado:     { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  procesando: { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  enviado:    { bg: '#E0E7FF', text: '#3730A3', border: '#6366F1' },
  entregado:  { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  cancelado:  { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' },
};

function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export function OrderStatusTracker({ currentStatus, history }: OrderStatusTrackerProps) {
  const isCancelled = currentStatus === 'cancelado';
  const currentIndex = FLOW.findIndex(s => s.key === currentStatus);
  const colors = STATUS_COLORS[currentStatus] || STATUS_COLORS['pendiente'];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-md mb-6">
      <h2 className="text-[#111827] mb-5" style={{ fontSize: '16px', fontWeight: '600' }}>
        Estado del pedido
      </h2>

      {/* Estado actual destacado */}
      <div
        className="flex items-center gap-3 p-4 rounded-xl mb-6 border-2"
        style={{ backgroundColor: colors.bg, borderColor: colors.border }}
      >
        <span style={{ fontSize: '28px' }}>
          {isCancelled ? '❌' : FLOW[currentIndex]?.icon || '•'}
        </span>
        <div>
          <p style={{ color: colors.text, fontSize: '16px', fontWeight: '700' }}>
            {isCancelled ? 'Pedido cancelado' : FLOW[currentIndex]?.label || currentStatus}
          </p>
          {history.length > 0 && (
            <p style={{ color: colors.text, fontSize: '12px', opacity: 0.8 }}>
              Actualizado: {formatDate(history[history.length - 1].date)}
            </p>
          )}
        </div>
      </div>

      {/* Barra de progreso (solo si no está cancelado) */}
      {!isCancelled && (
        <div className="mb-6">
          <div className="flex items-center justify-between relative">
            {/* Línea de fondo */}
            <div className="absolute top-4 left-0 right-0 h-1 bg-[#E5E7EB] z-0" />
            {/* Línea de progreso */}
            <div
              className="absolute top-4 left-0 h-1 bg-[#2563EB] z-0 transition-all duration-500"
              style={{ width: currentIndex >= 0 ? `${(currentIndex / (FLOW.length - 1)) * 100}%` : '0%' }}
            />
            {FLOW.map((step, i) => {
              const done = i <= currentIndex;
              const active = i === currentIndex;
              return (
                <div key={step.key} className="flex flex-col items-center z-10" style={{ flex: 1 }}>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                    style={{
                      backgroundColor: done ? '#2563EB' : '#fff',
                      borderColor: done ? '#2563EB' : '#D1D5DB',
                      boxShadow: active ? '0 0 0 4px rgba(37,99,235,0.2)' : 'none',
                    }}
                  >
                    {done
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      : <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
                    }
                  </div>
                  <span
                    className="mt-2 text-center leading-tight"
                    style={{
                      fontSize: '11px',
                      fontWeight: active ? '700' : '400',
                      color: done ? '#2563EB' : '#9CA3AF',
                      maxWidth: '60px',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Historial de cambios */}
      {history.length > 0 && (
        <div>
          <p className="text-[#6B7280] mb-3" style={{ fontSize: '13px', fontWeight: '600' }}>
            Historial
          </p>
          <div className="space-y-3">
            {[...history].reverse().map((h, i) => {
              const c = STATUS_COLORS[h.status] || { bg: '#F3F4F6', text: '#6B7280', border: '#E5E7EB' };
              return (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: c.border }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: c.bg, color: c.text }}
                      >
                        {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                      </span>
                      <span className="text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                        {formatDate(h.date)}
                      </span>
                    </div>
                    {h.comment && (
                      <p className="text-[#6B7280] mt-0.5" style={{ fontSize: '12px' }}>
                        {h.comment}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
