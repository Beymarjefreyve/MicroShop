import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { IncidentCard } from '../components/admin/IncidentCard';
import { ObservationModal } from '../components/admin/ObservationModal';
import { orderService, Incident as DBIncident } from '../services/orderService';
import { Incident } from '../data/incidents';

export function AdminIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showObservationModal, setShowObservationModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [incidentToCancel, setIncidentToCancel] = useState<Incident | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await orderService.getIncidents();
      const mapped = data.map((inc: DBIncident) => {
        let displayStatus: 'abierta' | 'en revisión' | 'resuelta' = 'abierta';
        if (inc.status === 'REVISION') displayStatus = 'en revisión';
        else if (inc.status === 'RESUELTA') displayStatus = 'resuelta';

        return {
          id: inc.id.toString(),
          status: displayStatus,
          orderId: inc.order_id.toString(),
          createdDate: inc.created_at,
          userName: inc.user_name || `Usuario #${inc.user_id}`,
          userEmail: 'cliente@microshop.com',
          description: inc.description,
          observations: inc.comment ? [{
            id: 1,
            author: 'Administrador',
            text: inc.comment,
            date: inc.updated_at.split('T')[0]
          }] : []
        };
      });
      setIncidents(mapped);
    } catch (e) {
      console.error('Error fetching incidents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowObservationModal(true);
  };

  const handleCancelOrder = (incident: Incident) => {
    setIncidentToCancel(incident);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (incidentToCancel) {
      try {
        await orderService.cancelOrder(Number(incidentToCancel.orderId));
        await orderService.updateIncidentStatus(Number(incidentToCancel.id), 'RESUELTA', 'Pedido cancelado por el administrador');
        await fetchIncidents();
        setShowCancelModal(false);
        setIncidentToCancel(null);
        showToastMessage('Pedido cancelado y incidencia resuelta correctamente');
      } catch (e) {
        console.error('Error al cancelar pedido/incidencia:', e);
      }
    }
  };

  const handleMarkResolved = async (incident: Incident) => {
    try {
      await orderService.updateIncidentStatus(Number(incident.id), 'RESUELTA', 'Marcada como resuelta por el administrador');
      await fetchIncidents();
      showToastMessage('Incidencia marcada como resuelta');
    } catch (e) {
      console.error('Error al resolver incidencia:', e);
    }
  };

  const handleAddObservation = async (incidentId: string, observation: string) => {
    try {
      const inc = incidents.find(i => i.id === incidentId);
      if (inc) {
        const newStatus = inc.status === 'abierta' ? 'REVISION' : inc.status.toUpperCase();
        await orderService.updateIncidentStatus(Number(incidentId), newStatus, observation);
        await fetchIncidents();
        showToastMessage('Observación agregada correctamente');
      }
    } catch (e) {
      console.error('Error al agregar observación:', e);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openIncidents = incidents.filter((inc) => inc.status === 'abierta');
  const reviewIncidents = incidents.filter((inc) => inc.status === 'en revisión');
  const resolvedIncidents = incidents.filter((inc) => inc.status === 'resuelta');

  if (loading) {
    return (
      <AdminLayout title="Incidencias">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
        </div>
      </AdminLayout>
    );
  }

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

      {/* Empty State */}
      {incidents.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#1F2937] rounded-xl border border-[#E5E7EB] dark:border-[#374151]">
          <p className="text-4xl mb-4">🎉</p>
          <h3 className="text-lg font-semibold text-[#111827] dark:text-white mb-2">Sin incidencias</h3>
          <p className="text-[#6B7280] dark:text-[#9CA3AF]">¡Excelente! No hay incidencias reportadas en el sistema.</p>
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
