interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderId: string;
}

export function CancelModal({ isOpen, onClose, onConfirm, orderId }: CancelModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full p-6 z-10">
        <h2 className="text-[#111827] mb-2" style={{ fontSize: '20px', fontWeight: '700' }}>
          ¿Cancelar pedido?
        </h2>
        <p className="text-[#6B7280] mb-6" style={{ fontSize: '14px' }}>
          Estás a punto de cancelar el pedido <strong>#{orderId}</strong>. Esta acción no se puede deshacer. ¿Deseas continuar?
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-gray-100 text-[#6B7280] hover:bg-gray-200 transition-colors"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            No, volver
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
