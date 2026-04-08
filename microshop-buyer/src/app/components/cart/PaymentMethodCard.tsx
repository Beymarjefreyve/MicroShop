interface PaymentMethodCardProps {
  id: string;
  title: string;
  description?: string;
  badge?: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export function PaymentMethodCard({
  title,
  description,
  badge,
  icon,
  selected,
  onSelect,
}: PaymentMethodCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-6 border-2 rounded-xl transition-all ${
        selected
          ? 'border-[#2563EB] bg-blue-50'
          : 'border-[#E5E7EB] bg-white hover:border-[#2563EB]/50'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Radio button */}
        <div className="mt-1">
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              selected ? 'border-[#2563EB]' : 'border-[#E5E7EB]'
            }`}
          >
            {selected && <div className="w-3 h-3 rounded-full bg-[#2563EB]" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {icon}
            <h3 className="text-[#111827] font-semibold">{title}</h3>
            {badge && (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                {badge}
              </span>
            )}
          </div>
          {description && <p className="text-[#6B7280] text-sm">{description}</p>}
        </div>
      </div>
    </button>
  );
}
