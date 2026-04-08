import { Incident } from '../../data/incidents';

interface IncidentCardProps {
  incident: Incident;
  onViewDetails: (incident: Incident) => void;
  onCancelOrder: (incident: Incident) => void;
  onMarkResolved: (incident: Incident) => void;
}

export function IncidentCard({
  incident,
  onViewDetails,
  onCancelOrder,
  onMarkResolved
}: IncidentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abierta':
        return 'bg-[#FEE2E2] text-[#991B1B]';
      case 'en revisión':
        return 'bg-[#FEF3C7] text-[#92400E]';
      case 'resuelta':
        return 'bg-[#D1FAE5] text-[#065F46]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[#111827] dark:text-white" style={{ fontSize: '16px', fontWeight: '600' }}>
              {incident.id}
            </span>
            <span
              className={`px-2 py-1 rounded-lg ${getStatusColor(incident.status)} capitalize`}
              style={{ fontSize: '12px', fontWeight: '500' }}
            >
              {incident.status}
            </span>
          </div>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
            Pedido: {incident.orderId}
          </p>
        </div>
        <span className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
          {new Date(incident.createdDate).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </span>
      </div>

      {/* Customer Info */}
      <div className="mb-4">
        <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px', fontWeight: '500' }}>
          {incident.userName}
        </p>
        <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
          {incident.userEmail}
        </p>
      </div>

      {/* Description */}
      <p className="text-[#111827] dark:text-white mb-4" style={{ fontSize: '14px' }}>
        {incident.description}
      </p>

      {/* Observations Count */}
      {incident.observations.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
            📝 {incident.observations.length} observación{incident.observations.length !== 1 ? 'es' : ''}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => onViewDetails(incident)}
          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors"
          style={{ fontSize: '14px', fontWeight: '500' }}
        >
          Ver detalles
        </button>
        {incident.status !== 'resuelta' && (
          <>
            <button
              onClick={() => onCancelOrder(incident)}
              className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              Cancelar pedido
            </button>
            <button
              onClick={() => onMarkResolved(incident)}
              className="px-4 py-2 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              Marcar resuelta
            </button>
          </>
        )}
      </div>
    </div>
  );
}
