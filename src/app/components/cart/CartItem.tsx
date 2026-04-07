import { CartItem as CartItemType } from '../context/CartContext';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const totalPrice = item.price * item.quantity;

  return (
    <div className="flex gap-4 p-4 bg-white border border-[#E5E7EB] rounded-xl">
      {/* Imagen */}
      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>

      {/* Info del producto */}
      <div className="flex-1">
        <h3 className="text-[#111827] font-medium">{item.name}</h3>
        <div className="mt-1">
          <span className="inline-block px-2 py-0.5 bg-blue-50 text-[#2563EB] text-xs rounded-md">
            {item.category}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-4">
          <span className="text-[#6B7280] text-sm">
            ${item.price.toFixed(2)} c/u
          </span>
          <div className="flex items-center gap-2 border border-[#E5E7EB] rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="px-3 py-1 text-[#6B7280] hover:bg-gray-50 transition-colors"
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span className="px-2 text-[#111827] font-medium">{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1 text-[#6B7280] hover:bg-gray-50 transition-colors"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Precio total y eliminar */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
          aria-label="Eliminar producto"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
        <div className="text-right">
          <div className="text-[#111827] text-lg font-semibold">
            ${totalPrice.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
