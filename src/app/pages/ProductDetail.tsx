import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { StarRating } from '../components/catalog/StarRating';
import { ProductCard } from '../components/catalog/ProductCard';
import { products, reviews } from '../data/products';

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

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const productReviews = reviews[Number(id)] || [];

  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(true);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <p className="text-[#6B7280]">Producto no encontrado</p>
          <button
            onClick={() => navigate('/catalog')}
            className="mt-4 text-[#2563EB] hover:underline"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const bgColor = imageColors[product.image] || '#9CA3AF';
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + delta)));
  };

  const handleSubmitReview = () => {
    if (userRating > 0 && reviewText.trim()) {
      alert('Reseña enviada correctamente');
      setUserRating(0);
      setReviewText('');
      setShowReviewForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Producto principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Imágenes */}
          <div>
            <div
              className="rounded-xl mb-4 flex items-center justify-center"
              style={{ backgroundColor: bgColor, height: '400px' }}
            >
              <svg
                width="120"
                height="120"
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

            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-lg cursor-pointer border-2 border-transparent hover:border-[#2563EB] transition-colors"
                  style={{ backgroundColor: bgColor, height: '80px' }}
                />
              ))}
            </div>
          </div>

          {/* Información */}
          <div>
            <div className="inline-block px-3 py-1 bg-[#2563EB] bg-opacity-10 text-[#2563EB] rounded-full text-sm mb-3" style={{ fontWeight: '500' }}>
              {product.category}
            </div>

            <h1 className="text-[#111827] mb-3" style={{ fontSize: '28px', fontWeight: '700' }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.rating} readOnly showNumber />
              <span className="text-[#6B7280] text-sm">
                ({product.reviews} reseñas)
              </span>
            </div>

            <p className="text-[#2563EB] mb-4" style={{ fontSize: '32px', fontWeight: '700' }}>
              ${product.price.toFixed(2)}
            </p>

            <p className="text-[#111827] mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="bg-white rounded-lg p-4 mb-6">
              <p className="text-[#6B7280] text-sm mb-2">Vendedor</p>
              <div className="flex items-center gap-2">
                <p className="text-[#111827]" style={{ fontWeight: '500' }}>
                  {product.sellerName}
                </p>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs" style={{ fontWeight: '500' }}>
                  Vendedor
                </span>
              </div>
            </div>

            {/* Selector de cantidad */}
            <div className="mb-6">
              <p className="text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
                Cantidad
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1}
                  className="w-10 h-10 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center text-[#111827]" style={{ fontWeight: '500' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity === product.stock}
                  className="w-10 h-10 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
                <span className="text-[#6B7280] text-sm ml-2">
                  {product.stock} disponibles
                </span>
              </div>
            </div>

            {/* Botones de compra */}
            <div className="space-y-3">
              <button
                disabled={product.stock === 0}
                className="w-full py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                style={{ fontSize: '16px', fontWeight: '600' }}
                onClick={() => alert('Producto agregado al carrito')}
              >
                {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
              <button
                disabled={product.stock === 0}
                className="w-full py-3 border-2 border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-[#2563EB] hover:bg-opacity-5 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                style={{ fontSize: '16px', fontWeight: '600' }}
                onClick={() => alert('Compra directa iniciada')}
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-[#111827] mb-6" style={{ fontSize: '22px', fontWeight: '600' }}>
            Reseñas de clientes
          </h2>

          {productReviews.length > 0 ? (
            <div className="space-y-6 mb-8">
              {productReviews.map((review) => (
                <div key={review.id} className="border-b border-[#E5E7EB] pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[#111827]" style={{ fontWeight: '500' }}>
                      {review.userName}
                    </p>
                    <p className="text-[#6B7280] text-sm">{review.date}</p>
                  </div>
                  <div className="mb-2">
                    <StarRating rating={review.rating} readOnly size="sm" />
                  </div>
                  <p className="text-[#111827]">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280] mb-8">Aún no hay reseñas para este producto.</p>
          )}

          {/* Formulario de reseña */}
          {showReviewForm && (
            <div className="border-t border-[#E5E7EB] pt-6">
              <h3 className="text-[#111827] mb-4" style={{ fontSize: '16px', fontWeight: '600' }}>
                Escribe tu reseña
              </h3>

              <div className="mb-4">
                <p className="text-[#111827] mb-2 text-sm" style={{ fontWeight: '500' }}>
                  Tu valoración
                </p>
                <StarRating rating={userRating} onRatingChange={setUserRating} size="lg" />
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Comparte tu experiencia con este producto..."
                rows={4}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none mb-4"
              />

              <button
                onClick={handleSubmitReview}
                disabled={userRating === 0 || !reviewText.trim()}
                className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                style={{ fontSize: '14px', fontWeight: '500' }}
              >
                Enviar reseña
              </button>
            </div>
          )}
        </div>

        {/* También te puede gustar */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-[#111827] mb-6" style={{ fontSize: '22px', fontWeight: '600' }}>
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
