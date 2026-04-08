interface OrderSummaryProps {
  subtotal: number;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
  showActions?: boolean;
}

export function OrderSummary({
  subtotal,
  onCheckout,
  onContinueShopping,
  showActions = true,
}: OrderSummaryProps) {
  const shipping = subtotal > 100 ? 0 : 5.0;
  const tax = subtotal * 0.19;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 sticky top-20">
      <h2 className="text-xl text-[#111827] font-semibold mb-4">Resumen del pedido</h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-[#6B7280]">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[#6B7280]">
          <span>Envío</span>
          {shipping === 0 ? (
            <span className="text-green-600 font-medium">Gratis</span>
          ) : (
            <span>${shipping.toFixed(2)}</span>
          )}
        </div>
        {subtotal > 100 && (
          <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            ¡Envío gratis en compras mayores a $100!
          </div>
        )}
        <div className="flex justify-between text-[#6B7280]">
          <span>Impuesto (19%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-[#E5E7EB] pt-3 flex justify-between">
          <span className="text-[#111827] text-lg font-semibold">Total</span>
          <span className="text-[#111827] text-xl font-bold">${total.toFixed(2)}</span>
        </div>
      </div>

      {showActions && (
        <div className="space-y-3">
          {onCheckout && (
            <button
              onClick={onCheckout}
              className="w-full bg-[#2563EB] text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Proceder al pago
            </button>
          )}
          {onContinueShopping && (
            <button
              onClick={onContinueShopping}
              className="w-full border-2 border-[#2563EB] text-[#2563EB] py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Seguir comprando
            </button>
          )}
        </div>
      )}
    </div>
  );
}
