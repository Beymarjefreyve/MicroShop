interface OrderFiltersProps {
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onClearFilters: () => void;
}

export function OrderFilters({
  selectedStatus,
  onStatusChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: OrderFiltersProps) {
  const statuses = [
    { value: 'todos', label: 'Todos' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en proceso', label: 'En proceso' },
    { value: 'entregado', label: 'Entregado' },
    { value: 'cancelado', label: 'Cancelado' },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-md">
      <div className="flex flex-col gap-4">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => onStatusChange(status.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === status.value
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
              }`}
              style={{ fontSize: '14px', fontWeight: '500' }}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Date filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex-1">
            <label className="block text-[#6B7280] mb-1" style={{ fontSize: '13px' }}>
              Desde
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              style={{ fontSize: '14px' }}
            />
          </div>
          <div className="flex-1">
            <label className="block text-[#6B7280] mb-1" style={{ fontSize: '13px' }}>
              Hasta
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent"
              style={{ fontSize: '14px' }}
            />
          </div>
          <button
            onClick={onClearFilters}
            className="text-[#2563EB] hover:underline py-2"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
