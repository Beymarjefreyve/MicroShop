import { useState, useMemo, useCallback, useEffect } from 'react';
import { Navbar } from '../components/shared/Navbar';
import { SearchBar } from '../components/catalog/SearchBar';
import { AiSearchBar } from '../components/catalog/AiSearchBar';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { ProductCard } from '../components/catalog/ProductCard';
import { catalogService, Product, Category } from '../services/catalogService';
import { recommendationService } from '../services/recommendationService';
import authService from '../services/authService';

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Estado de búsqueda IA
  const [aiResults, setAiResults] = useState<Product[]>([]);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiSource, setAiSource] = useState('');
  const [aiActive, setAiActive] = useState(false);

  // Fetch products, categories, and recommendations on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          catalogService.getProducts(),
          catalogService.getCategories()
        ]);
        setProducts(productsData.results);
        setCategories(categoriesData.results);

        // Fetch real recommendations if user is logged in
        const user = authService.getUser();
        if (user && user.id) {
          const recommendations = await recommendationService.getRecommendationsByUser(user.id);
          if (recommendations && recommendations.length > 0) {
            setRecommendedProducts(recommendations.slice(0, 5));
          } else {
            // fallback if no recommendations yet
            setRecommendedProducts(productsData.results.slice(0, 5));
          }
        } else {
          setRecommendedProducts(productsData.results.slice(0, 5));
        }
      } catch (err: any) {
        setError('Error al cargar el catálogo. Por favor, intente más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000000]);
    setSelectedRating(0);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleAiResults = (products: Product[], explanation: string, source: string) => {
    setAiResults(products);
    setAiExplanation(explanation);
    setAiSource(source);
    setAiActive(true);
    setCurrentPage(1);
  };

  const handleAiClear = () => {
    setAiResults([]);
    setAiExplanation('');
    setAiSource('');
    setAiActive(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const name = product.name || '';
      const description = product.description || '';
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategories.length === 0 ||
        (product.category_name && selectedCategories.includes(product.category_name));

      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating = (product.average_rating || 0) >= selectedRating;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    });
  }, [products, searchQuery, selectedCategories, priceRange, selectedRating]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage) * itemsPerPage
  );

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

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Search bar */}
        <div className="mb-4">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Barra de búsqueda IA */}
        <div className="mb-8">
          <AiSearchBar
            onResults={handleAiResults}
            onClear={handleAiClear}
            isActive={aiActive}
          />
        </div>

        {/* Resultados de búsqueda IA */}
        {aiActive && (
          <div className="mb-10">
            {/* Banner de explicación */}
            <div className={`flex items-start gap-3 p-4 rounded-xl mb-5 border ${
              aiSource === 'FALLBACK'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <span className="text-xl flex-shrink-0">
                {aiSource === 'FALLBACK' ? '⚠️' : '✨'}
              </span>
              <div>
                <p className={`text-sm font-semibold ${
                  aiSource === 'FALLBACK' ? 'text-amber-700' : 'text-purple-700'
                }`}>
                  {aiSource === 'FALLBACK'
                    ? 'El asistente IA no está disponible ahora'
                    : aiSource === 'AI+HISTORY'
                      ? 'Resultados personalizados con IA'
                      : 'Resultados de búsqueda con IA'}
                </p>
                {aiExplanation && (
                  <p className={`text-sm mt-0.5 ${
                    aiSource === 'FALLBACK' ? 'text-amber-600' : 'text-purple-600'
                  }`}>
                    {aiExplanation}
                  </p>
                )}
              </div>
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                aiSource === 'FALLBACK'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {aiResults.length} resultados
              </span>
            </div>

            {aiResults.length === 0 ? (
              <div className="text-center py-12 text-[#6B7280]">
                <span className="text-4xl block mb-3">🔍</span>
                No encontré productos para esa búsqueda. Intenta con otras palabras.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {aiResults.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image || ''}
                    rating={product.average_rating || 0}
                    stock={product.stock}
                  />
                ))}
              </div>
            )}

            {/* Separador para volver al catálogo */}
            <div className="mt-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-[#E5E7EB]" />
              <button
                onClick={handleAiClear}
                className="text-sm text-[#6B7280] hover:text-[#2563EB] transition-colors flex items-center gap-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Ver catálogo completo
              </button>
              <div className="flex-1 h-px bg-[#E5E7EB]" />
            </div>
          </div>
        )}

        {/* Recomendados (solo cuando no hay búsqueda IA activa) */}
        {!aiActive && recommendedProducts.length > 0 && (
          <div className="mb-10">
            <h2 className="text-[#111827] mb-4" style={{ fontSize: '20px', fontWeight: '600' }}>
              Recomendados para ti
            </h2>
            <div className="overflow-x-auto pb-4 -mx-4 px-4">
              <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                {recommendedProducts.map((product) => (
                  <div key={product.id} className="w-64 flex-shrink-0">
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image || ''}
                      rating={product.average_rating || 0}
                      stock={product.stock}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main content (oculto cuando hay resultados IA activos) */}
        {!aiActive && (
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <FilterSidebar
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedRating={selectedRating}
              onRatingChange={setSelectedRating}
              onClearFilters={handleClearFilters}
              categories={categories.map(c => c.name)}
            />
          </aside>

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[#6B7280] text-sm">
                {filteredProducts.length} productos encontrados
              </p>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="text-center py-16">
                <svg className="mx-auto mb-4 w-16 h-16 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-[#6B7280]">No se encontraron productos</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image || ''}
                      rating={product.average_rating || 0}
                      stock={product.stock}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#111827] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="px-4 py-2 text-[#111827]">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#111827] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        )} {/* fin !aiActive */}
      </div>
    </div>
  );
}
