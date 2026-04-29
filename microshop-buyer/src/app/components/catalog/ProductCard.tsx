import { Link } from 'react-router';
import { StarRating } from './StarRating';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  rating: number;
  stock: number;
  image: string;
}

const imageColors: Record<string, string> = {
  laptop: '#3B82F6',
  tshirt: '#10B981',
  coffee: '#8B4513',
  ball: '#EF4444',
  headphones: '#6366F1',
  book: '#F59E0B',
  pans: '#64748B',
  shoes: '#EC4899',
  mouse: '#06B6D4',
  pants: '#6B7280',
  organizer: '#84CC16',
  rope: '#14B8A6'
};

export function ProductCard({ id, name, price, rating, stock, image }: ProductCardProps) {
  const isOutOfStock = stock === 0;
  const bgColor = imageColors[image] || '#9CA3AF';

  return (
    <Link to={`/product/${id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden" style={{ backgroundColor: bgColor, height: '200px' }}>
          {image && (image.startsWith('http') || image.startsWith('/media/')) ? (
            <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
                opacity="0.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs" style={{ fontWeight: '600' }}>
              Agotado
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-[#111827] mb-2 line-clamp-2" style={{ fontSize: '15px', fontWeight: '500', minHeight: '40px' }}>
            {name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            <StarRating rating={rating} readOnly size="sm" />
          </div>

          <div className="mt-auto">
            <p className="text-[#2563EB] mb-3" style={{ fontSize: '20px', fontWeight: '700' }}>
              ${price.toFixed(2)}
            </p>

            <p className="text-[#6B7280] text-xs mb-3">
              {stock > 0 ? `${stock} disponibles` : 'Sin stock'}
            </p>

            <button
              disabled={isOutOfStock}
              className={`w-full py-2 rounded-lg transition-colors ${
                isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
              }`}
              style={{ fontSize: '14px', fontWeight: '500' }}
              onClick={(e) => {
                e.preventDefault();
                if (!isOutOfStock) {
                  alert('Producto agregado al carrito');
                }
              }}
            >
              {isOutOfStock ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
