import { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { StarRating } from '../components/catalog/StarRating';
import { ProductCard } from '../components/catalog/ProductCard';
import { CartContext } from '../context/CartContext';
import { catalogService, Product } from '../services/catalogService';
import noImage from '../../assets/no-image.png';
import { formatCOP } from '../utils/format';
import { recommendationService } from '../services/recommendationService';
import authService from '../services/authService';
import { orderService } from '../services/orderService';



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

const CATALOG_URL = import.meta.env.VITE_CATALOG_URL || 'http://localhost:8002/api';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const cartContext = useContext(CartContext);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false); // false until purchase verified
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sellerStats, setSellerStats] = useState<{
    seller_name: string;
    total_orders: number;
    total_units_sold: number;
    total_products: number;
  } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await catalogService.getProductById(Number(id));
        setProduct(data);

        // Registrar vista en el microservicio de recomendaciones si el usuario está logueado
        const currentUser = authService.getUser();
        if (currentUser && currentUser.id) {
          recommendationService.registerView(currentUser.id, data.id, data.category);

          // Verificar si el usuario ya compró este producto (en órdenes PAGADO/ENTREGADO)
          try {
            const orders = await orderService.getOrders(currentUser.id);
            const purchased = orders.some(order =>
              ['PAGADO', 'ENTREGADO', 'EN_CAMINO'].includes(order.status) &&
              order.items.some(item => item.product_id === data.id)
            );
            setHasPurchased(purchased);

            // Verificar si el usuario ya dejó una reseña para este producto
            const existingReview = (data as any).reviews?.some(
              (r: any) => r.user_id === currentUser.id
            );
            setAlreadyReviewed(!!existingReview);

            // Mostrar formulario solo si compró y no ha reseñado aún
            setShowReviewForm(purchased && !existingReview);
          } catch {
            // Si falla la consulta de órdenes, no mostrar el formulario
          }
        }
        
        // Fetch related products (same category)
        const related = await catalogService.getProducts({ 
          category: data.category.toString()
        });
        setRelatedProducts(related.results.filter(p => p.id !== data.id).slice(0, 4));

        // Fetch seller info + sales stats (con reintento para cold starts de Render)
        if (data.seller_id) {
          const fetchSellerInfo = async (retries = 3, delay = 4000): Promise<void> => {
            try {
              const resp = await fetch(`${CATALOG_URL}/products/seller_info/?seller_id=${data.seller_id}&product_id=${data.id}`, {
                headers: { 'Authorization': `Bearer ${authService.getToken()}` }
              });
              if (resp.ok) {
                const stats = await resp.json();
                setSellerStats(stats);
              } else if (retries > 0) {
                setTimeout(() => fetchSellerInfo(retries - 1, delay), delay);
              }
            } catch (e) {
              console.warn('No se pudo cargar info del vendedor', e);
              if (retries > 0) {
                setTimeout(() => fetchSellerInfo(retries - 1, delay), delay);
              }
            }
          };
          fetchSellerInfo();
        }
      } catch (err: any) {
        setError('No se pudo cargar el producto.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Refrescar estadísticas del vendedor cada 30s mientras el usuario está en la página
  useEffect(() => {
    if (!product?.seller_id) return;

    const refreshStats = async () => {
      try {
        const resp = await fetch(`${CATALOG_URL}/products/seller_info/?seller_id=${product.seller_id}&product_id=${product.id}`, {
          headers: { 'Authorization': `Bearer ${authService.getToken()}` }
        });
        if (resp.ok) {
          const stats = await resp.json();
          setSellerStats(stats);
        }
      } catch {
        // silencioso — no interrumpir la experiencia si falla
      }
    };

    const interval = setInterval(refreshStats, 30000);
    return () => clearInterval(interval);
  }, [product?.seller_id]);

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

  const mainImage = selectedImage || product.image || '';
  const isUrl = mainImage && (mainImage.startsWith('http') || mainImage.startsWith('/media') || mainImage.includes('/') || mainImage.includes('.'));
  const bgColor = !isUrl ? (imageColors[mainImage || ''] || '#F3F4F6') : 'transparent';

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + delta)));
  };

  const handleSubmitReview = async () => {
    if (!userRating || !reviewText.trim()) return;
    const currentUser = authService.getUser();
    try {
      const resp = await fetch(`${CATALOG_URL}/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`,
        },
        body: JSON.stringify({
          product: product!.id,
          user_id: currentUser?.id ?? 0,
          rating: userRating,
          comment: reviewText,
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      setShowReviewForm(false);
      setUserRating(0);
      setReviewText('');
      // Reload product to show updated average_rating
      const updated = await catalogService.getProductById(Number(id));
      setProduct(updated);
    } catch (error) {
      console.error('Error submitting review:', error);
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
              className="rounded-xl mb-4 flex items-center justify-center overflow-hidden bg-gray-50 shadow-inner"
              style={{ backgroundColor: bgColor, height: '400px' }}
            >
              {isUrl || mainImage === '' ? (
                <img 
                  src={mainImage || noImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = noImage;
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
                    onClick={() => setSelectedImage(img.image)}
                    className={`rounded-lg cursor-pointer border-2 transition-all overflow-hidden bg-gray-50 ${
                      (selectedImage || product.image) === img.image
                        ? 'border-[#2563EB] shadow-md'
                        : 'border-transparent hover:border-[#2563EB]'
                    }`}
                    style={{ height: '80px' }}
                  >
                    <img 
                      src={img.image} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => (e.target as HTMLImageElement).src = noImage}
                    />
                  </div>
                ))
              ) : (
                [1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-lg border-2 border-transparent bg-gray-100 flex items-center justify-center"
                    style={{ height: '80px' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
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
              {formatCOP(product.price)}
            </p>

            <p className="text-[#111827] mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
              <p className="text-[#6B7280] text-sm mb-3">Vendedor</p>
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Nombre */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {(sellerStats?.seller_name || product.seller_name || 'V').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[#111827]" style={{ fontWeight: '600', fontSize: '15px' }}>
                    {sellerStats?.seller_name || product.seller_name || `Vendedor #${product.seller_id}`}
                  </p>
                </div>

                {/* Ventas — solo si hay datos reales */}
                {sellerStats !== null && (
                  <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-green-700 font-bold text-sm">
                      {sellerStats.total_units_sold}
                    </span>
                    <span className="text-green-600 text-sm">
                      {sellerStats.total_units_sold === 1 ? 'unidad vendida' : 'unidades vendidas'}
                    </span>
                  </div>
                )}
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
                disabled={product.stock === 0 || isAdding}
                className={`w-full py-3 text-white rounded-lg transition-all shadow-lg shadow-blue-200 ${
                  product.stock === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : isAdding 
                      ? 'bg-green-500 scale-95' 
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] hover:-translate-y-1'
                }`}
                style={{ fontSize: '16px', fontWeight: '600' }}
                onClick={() => {
                  if (cartContext) {
                    setIsAdding(true);
                    cartContext.addItem(product, quantity);
                    setTimeout(() => setIsAdding(false), 300);
                  }
                }}
              >
                {product.stock === 0 ? 'Sin stock' : isAdding ? '¡Agregado!' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </div>

        {/* Reseñas */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-[#111827] mb-6" style={{ fontSize: '22px', fontWeight: '600' }}>
            Reseñas de clientes
          </h2>

          {/* Lista de reseñas existentes */}
          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-4 mb-8">
              {(product.reviews as any[]).map((review: any) => (
                <div key={review.id} className="border border-[#E5E7EB] rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={review.rating} readOnly size="sm" />
                    <span className="text-[#6B7280] text-xs">Usuario #{review.user_id}</span>
                  </div>
                  <p className="text-[#111827] text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280] mb-8">Aún no hay reseñas para este producto.</p>
          )}

          {/* Formulario para agregar reseña / mensajes de estado */}
          {showReviewForm ? (
            <div className="border-t border-[#E5E7EB] pt-6">
              <h3 className="text-[#111827] mb-4" style={{ fontSize: '16px', fontWeight: '600' }}>
                Escribir una reseña
              </h3>
              <div className="mb-4">
                <p className="text-[#6B7280] text-sm mb-2">Tu calificación</p>
                <StarRating rating={userRating} onRatingChange={setUserRating} size="lg" />
              </div>
              <textarea
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                placeholder="Cuéntanos tu experiencia con este producto..."
                className="w-full border border-[#E5E7EB] rounded-lg p-3 text-[#111827] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2563EB] mb-4"
                rows={4}
              />
              <button
                disabled={!userRating || !reviewText.trim()}
                onClick={handleSubmitReview}
                className="px-6 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-[#1D4ED8] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Enviar reseña
              </button>
            </div>
          ) : alreadyReviewed ? (
            <p className="text-[#6B7280] text-sm border-t border-[#E5E7EB] pt-4">
              Ya escribiste una reseña para este producto.
            </p>
          ) : hasPurchased ? (
            <p className="text-green-600 text-sm font-medium border-t border-[#E5E7EB] pt-4">
              ✓ Tu reseña fue enviada correctamente.
            </p>
          ) : authService.getUser() ? (
            <p className="text-[#6B7280] text-sm border-t border-[#E5E7EB] pt-4">
              Solo puedes dejar una reseña si compraste este producto.
            </p>
          ) : null}
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
