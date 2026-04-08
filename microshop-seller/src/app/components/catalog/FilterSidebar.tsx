interface FilterSidebarProps {
  selectedCategories: string[];
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedRating: number;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];

export function FilterSidebar({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedRating,
  onRatingChange,
  onClearFilters
}: FilterSidebarProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[#111827]" style={{ fontSize: '18px', fontWeight: '600' }}>
          Filtros
        </h3>
        <button
          onClick={onClearFilters}
          className="text-[#2563EB] hover:text-[#1D4ED8] text-sm"
          style={{ fontWeight: '500' }}
        >
          Limpiar
        </button>
      </div>

      {/* Categorías */}
      <div className="mb-6">
        <h4 className="text-[#111827] mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>
          Categoría
        </h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
                className="w-4 h-4 text-[#2563EB] border-gray-300 rounded focus:ring-[#2563EB]"
              />
              <span className="text-[#111827] text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div className="mb-6">
        <h4 className="text-[#111827] mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>
          Precio
        </h4>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) => onPriceRangeChange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
          />
          <div className="flex items-center justify-between text-sm text-[#6B7280]">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Valoración */}
      <div>
        <h4 className="text-[#111827] mb-3" style={{ fontSize: '14px', fontWeight: '600' }}>
          Valoración mínima
        </h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg transition-colors ${
                selectedRating === rating
                  ? 'bg-[#2563EB] bg-opacity-10 border border-[#2563EB]'
                  : 'hover:bg-gray-50'
              }`}
            >
              {[...Array(rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4"
                  fill="#FCD34D"
                  stroke="#FCD34D"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
              <span className="text-[#6B7280] text-sm">y más</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
