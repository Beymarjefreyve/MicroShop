import { useState, useEffect } from 'react';

interface InlineStockEditorProps {
  initialStock: number;
  productId: number;
  onUpdate: (productId: number, newStock: number) => void;
}

export function InlineStockEditor({ initialStock, productId, onUpdate }: InlineStockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [stock, setStock] = useState(initialStock);
  const [tempStock, setTempStock] = useState(String(initialStock));

  useEffect(() => {
    setStock(initialStock);
    setTempStock(String(initialStock));
  }, [initialStock]);

  const handleSave = () => {
    const newStock = parseInt(tempStock);
    if (!isNaN(newStock) && newStock >= 0) {
      setStock(newStock);
      onUpdate(productId, newStock);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTempStock(String(stock));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={tempStock}
          onChange={(e) => setTempStock(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-20 px-2 py-1 border-2 border-[#2563EB] rounded-lg text-[#111827] dark:text-white bg-white dark:bg-[#111827] focus:outline-none"
          style={{ fontSize: '14px' }}
          autoFocus
          min="0"
        />
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-700 transition-colors"
          title="Guardar"
        >
          ✓
        </button>
        <button
          onClick={handleCancel}
          className="text-red-600 hover:text-red-700 transition-colors"
          title="Cancelar"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 text-[#111827] dark:text-white hover:text-[#2563EB] dark:hover:text-[#2563EB] transition-colors"
      style={{ fontSize: '14px' }}
    >
      <span>{stock}</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
  );
}
