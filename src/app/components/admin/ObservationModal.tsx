import { useState } from 'react';
import { Incident } from '../../data/incidents';

interface ObservationModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onAddObservation: (incidentId: string, observation: string) => void;
}

export function ObservationModal({
  incident,
  isOpen,
  onClose,
  onAddObservation
}: ObservationModalProps) {
  const [observation, setObservation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !incident) return null;

  const handleSubmit = async () => {
    if (!observation.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onAddObservation(incident.id, observation);
    setObservation('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white dark:bg-[#1F2937] rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#111827] dark:text-white" style={{ fontSize: '20px', fontWeight: '600' }}>
                {incident.id} - Observaciones
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

            {/* Incident Info */}
            <div className="bg-gray-50 dark:bg-[#111827] rounded-xl p-4 mb-6">
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-2" style={{ fontSize: '12px' }}>
                Pedido: {incident.orderId}
              </p>
              <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px' }}>
                {incident.description}
              </p>
            </div>

            {/* Observation History */}
            {incident.observations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-[#111827] dark:text-white mb-3" style={{ fontSize: '16px', fontWeight: '600' }}>
                  Historial de observaciones
                </h3>
                <div className="space-y-3">
                  {incident.observations.map((obs) => (
                    <div
                      key={obs.id}
                      className="bg-gray-50 dark:bg-[#111827] rounded-xl p-4 border-l-4 border-[#2563EB]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-[#111827] dark:text-white" style={{ fontSize: '14px', fontWeight: '500' }}>
                          {obs.author}
                        </p>
                        <span className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '12px' }}>
                          {new Date(obs.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                        {obs.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Observation */}
            <div className="mb-6">
              <label className="block text-[#111827] dark:text-white mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                Agregar nueva observación
              </label>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Escribe tu observación aquí..."
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-[#111827] border-2 border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
                style={{ fontSize: '14px' }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 border-2 border-[#E5E7EB] dark:border-[#374151] text-[#6B7280] dark:text-[#9CA3AF] rounded-lg hover:bg-gray-50 dark:hover:bg-[#374151] transition-colors"
                style={{ fontSize: '14px', fontWeight: '500' }}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                style={{ fontSize: '14px', fontWeight: '500' }}
                disabled={!observation.trim() || isSubmitting}
              >
                {isSubmitting && (
                  <svg
                    className="animate-spin"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                  </svg>
                )}
                Agregar observación
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
