import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { StarRating } from '../components/catalog/StarRating';
import { ProductCard } from '../components/catalog/ProductCard';
import { catalogService, Product } from '../services/catalogService';

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
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await catalogService.getProductById(Number(id));
        setProduct(data);
        
        // Fetch related products (same category)
        const related = await catalogService.getProducts({ 
          category: data.category.toString()
        });
        setRelatedProducts(related.results.filter(p => p.id !== data.id).slice(0, 4));
      } catch (err: any) {
        setError('No se pudo cargar el producto.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <Navbar />
        <div className="pt-32 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <p className="text-[#6B7280]">{error || 'Producto no encontrado'}</p>
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

  const isUrl = product.image && (product.image.startsWith('http') || product.image.startsWith('/media'));
  const bgColor = !isUrl ? (imageColors[product.image || ''] || '#9CA3AF') : 'transparent';

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Imágenes */}
          <div>
            <div
              className="rounded-xl mb-4 flex items-center justify-center overflow-hidden"
              style={{ backgroundColor: bgColor, height: '400px' }}
            >
              {isUrl ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x600?text=MicroShop';
                  }}
                />
              ) : (
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              )}
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-4 gap-3">
              {(product.images && product.images.length > 0) ? (
                product.images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="rounded-lg cursor-pointer border-2 border-transparent hover:border-[#2563EB] transition-all overflow-hidden"
                    style={{ height: '80px' }}
                  >
                    <img src={img.image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))
              ) : (
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg cursor-pointer border-2 border-transparent hover:border-[#2563EB] transition-colors"
                    style={{ backgroundColor: bgColor, height: '80px' }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Información */}
          <div>
            <div className="inline-block px-3 py-1 bg-[#2563EB] bg-opacity-10 text-[#2563EB] rounded-full text-sm mb-3" style={{ fontWeight: '500' }}>
              {product.category_name || 'Sin categoría'}
            </div>

            <h1 className="text-[#111827] mb-3" style={{ fontSize: '28px', fontWeight: '700' }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={product.average_rating || 0} readOnly showNumber />
            </div>

            <p className="text-[#2563EB] mb-4" style={{ fontSize: '32px', fontWeight: '700' }}>
              ${product.price.toFixed(2)}
            </p>

            <p className="text-[#111827] mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
              <p className="text-[#6B7280] text-sm mb-2">Vendedor</p>
              <div className="flex items-center gap-2">
                <p className="text-[#111827]" style={{ fontWeight: '500' }}>
                  {product.seller_name || 'Vendedor Verificado'}
                </p>
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs" style={{ fontWeight: '500' }}>
                  Vendedor #{product.seller_id}
                </span>
              </div>
            </div>

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

            <div className="space-y-3">
              <button
                disabled={product.stock === 0}
                className="w-full py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-200"
                style={{ fontSize: '16px', fontWeight: '600' }}
                onClick={() => alert('Producto agregado al carrito')}
              >
                {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </div>

        {/* Reseñas (Mocked for now as catalog-service might not handle reviews yet) */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-[#111827] mb-6" style={{ fontSize: '22px', fontWeight: '600' }}>
            Reseñas de clientes
          </h2>
          <p className="text-[#6B7280] mb-8">Aún no hay reseñas para este producto.</p>
        </div>

        {/* También te puede gustar */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-[#111827] mb-6" style={{ fontSize: '22px', fontWeight: '600' }}>
              También te puede gustar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard 
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  rating={p.average_rating || 0}
                  stock={p.stock}
                  image={p.image || ''}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
