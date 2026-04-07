import { useState } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { IncidentCard } from '../components/admin/IncidentCard';
import { ObservationModal } from '../components/admin/ObservationModal';
import { incidents as initialIncidents, Incident } from '../data/incidents';

export function AdminIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [incidentToCancel, setIncidentToCancel] = useState<Incident | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowObservationModal(true);
  };

  const handleCancelOrder = (incident: Incident) => {
    setIncidentToCancel(incident);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (incidentToCancel) {
      setIncidents(
        incidents.map((inc) =>
          inc.id === incidentToCancel.id ? { ...inc, status: 'resuelta' } : inc
        )
      );
      setShowCancelModal(false);
      setIncidentToCancel(null);
      showToastMessage('Pedido cancelado y incidencia resuelta correctamente');
    }
  };

  const handleMarkResolved = (incident: Incident) => {
    setIncidents(
      incidents.map((inc) =>
        inc.id === incident.id ? { ...inc, status: 'resuelta' } : inc
      )
    );
    showToastMessage('Incidencia marcada como resuelta');
  };

  const handleAddObservation = (incidentId: string, observation: string) => {
    setIncidents(
      incidents.map((inc) => {
        if (inc.id === incidentId) {
          const newObservation = {
            id: inc.observations.length + 1,
            author: 'Admin María González',
            text: observation,
            date: new Date().toISOString().split('T')[0]
          };
          return {
            ...inc,
            observations: [...inc.observations, newObservation]
          };
        }
        return inc;
      })
    );
    showToastMessage('Observación agregada correctamente');
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openIncidents = incidents.filter((inc) => inc.status === 'abierta');
  const reviewIncidents = incidents.filter((inc) => inc.status === 'en revisión');
  const resolvedIncidents = incidents.filter((inc) => inc.status === 'resuelta');

  return (
    <AdminLayout title="Incidencias">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                Abiertas
              </p>
              <p className="mt-2 text-[#111827] dark:text-white" style={{ fontSize: '28px', fontWeight: '600' }}>
                {openIncidents.length}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                En revisión
              </p>
              <p className="mt-2 text-[#111827] dark:text-white" style={{ fontSize: '28px', fontWeight: '600' }}>
                {reviewIncidents.length}
              </p>
            </div>
            <div className="text-4xl">🔍</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                Resueltas
              </p>
              <p className="mt-2 text-[#111827] dark:text-white" style={{ fontSize: '28px', fontWeight: '600' }}>
                {resolvedIncidents.length}
              </p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>
      </div>

      {/* Open Incidents */}
      {openIncidents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[#111827] dark:text-white mb-4" style={{ fontSize: '18px', fontWeight: '600' }}>
            Incidencias abiertas
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {openIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onViewDetails={handleViewDetails}
                onCancelOrder={handleCancelOrder}
                onMarkResolved={handleMarkResolved}
              />
            ))}
          </div>
        </div>
      )}

      {/* Review Incidents */}
      {reviewIncidents.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[#111827] dark:text-white mb-4" style={{ fontSize: '18px', fontWeight: '600' }}>
            Incidencias en revisión
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reviewIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onViewDetails={handleViewDetails}
                onCancelOrder={handleCancelOrder}
                onMarkResolved={handleMarkResolved}
              />
            ))}
          </div>
        </div>
      )}

      {/* Resolved Incidents */}
      {resolvedIncidents.length > 0 && (
        <div>
          <h2 className="text-[#6B7280] dark:text-[#9CA3AF] mb-4" style={{ fontSize: '18px', fontWeight: '600' }}>
            Incidencias resueltas
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {resolvedIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onViewDetails={handleViewDetails}
                onCancelOrder={handleCancelOrder}
                onMarkResolved={handleMarkResolved}
              />
            ))}
          </div>
        </div>
      )}

      {/* Observation Modal */}
      <ObservationModal
        incident={selectedIncident}
        isOpen={showObservationModal}
        onClose={() => {
          setShowObservationModal(false);
          setSelectedIncident(null);
        }}
        onAddObservation={handleAddObservation}
      />

      {/* Cancel Order Modal */}
      {showCancelModal && incidentToCancel && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCancelModal(false)}
          >
            <div
              className="bg-white dark:bg-[#1F2937] rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[#111827] dark:text-white mb-4" style={{ fontSize: '20px', fontWeight: '600' }}>
                ¿Cancelar pedido?
              </h2>
              <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-6" style={{ fontSize: '14px' }}>
                Estás a punto de cancelar el pedido <strong>{incidentToCancel.orderId}</strong>. Esta acción marcará
                la incidencia como resuelta. ¿Deseas continuar?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-6 py-2.5 border-2 border-[#E5E7EB] dark:border-[#374151] text-[#6B7280] dark:text-[#9CA3AF] rounded-lg hover:bg-gray-50 dark:hover:bg-[#374151] transition-colors"
                  style={{ fontSize: '14px', fontWeight: '500' }}
                >
                  No, volver
                </button>
                <button
                  onClick={confirmCancelOrder}
                  className="flex-1 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  style={{ fontSize: '14px', fontWeight: '500' }}
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#065F46] text-white px-6 py-3 rounded-lg shadow-xl animate-slide-up z-50">
          <div className="flex items-center gap-2">
            <span className="text-xl">✓</span>
            <span style={{ fontSize: '14px', fontWeight: '500' }}>{toastMessage}</span>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
