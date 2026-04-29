import { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { AdminTable } from '../components/admin/AdminTable';
import { InlineStockEditor } from '../components/admin/InlineStockEditor';
import { catalogService, Product } from '../services/catalogService';

export function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await catalogService.getProducts();
      setProducts(data.results);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los productos. Asegúrate de que el microservicio esté activo.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (productId: number, newStock: number) => {
    try {
      await catalogService.updateProduct(productId, { stock: newStock });
      setProducts(
        products.map((product) =>
          product.id === productId ? { ...product, stock: newStock } : product
        )
      );
    } catch (err) {
      console.error(err);
      alert('Error al actualizar el stock');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || 
                           product.category_name === categoryFilter || 
                           product.category.toString() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span
          className="px-2 py-1 rounded-lg bg-[#FEE2E2] text-[#991B1B]"
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          Sin stock
        </span>
      );
    } else if (stock <= 10) {
      return (
        <span
          className="px-2 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E]"
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          Stock bajo
        </span>
      );
    } else {
      return (
        <span
          className="px-2 py-1 rounded-lg bg-[#D1FAE5] text-[#065F46]"
          style={{ fontSize: '12px', fontWeight: '500' }}
        >
          En stock
        </span>
      );
    }
  };

  const categories = ['Todas', ...Array.from(new Set(products.map((p) => p.category_name || p.category.toString())))];

  const columns = [
    {
      header: 'Imagen',
      accessor: (row: Product) => (
        <div className="w-10 h-10 rounded border border-gray-200 overflow-hidden bg-gray-50">
          {row.image ? (
            <img src={row.image} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}
        </div>
      ),
      width: '10%'
    },
    { header: 'Producto', accessor: 'name' as const, width: '20%' },
    { 
      header: 'Vendedor', 
      accessor: (row: Product) => row.seller_name || `Vendedor ${row.seller_id}`, 
      width: '20%' 
    },
    { 
      header: 'Categoría', 
      accessor: (row: Product) => row.category_name || row.category.toString(), 
      width: '15%' 
    },
    {
      header: 'Stock',
      accessor: (row: Product) => (
        <InlineStockEditor
          initialStock={row.stock}
          productId={row.id}
          onUpdate={handleUpdateStock}
        />
      ),
      width: '15%'
    },
    {
      header: 'Estado',
      accessor: (row: Product) => getStockBadge(row.stock),
      width: '15%'
    },
    {
      header: 'Precio',
      accessor: (row: Product) => `$${row.price.toFixed(2)}`,
      width: '10%'
    }
  ];

  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  return (
    <AdminLayout title="Inventario">
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                Productos totales
              </p>
              <p className="mt-2 text-[#111827] dark:text-white" style={{ fontSize: '28px', fontWeight: '600' }}>
                {loading ? '...' : products.length}
              </p>
            </div>
            <div className="text-4xl">📦</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                Stock bajo / Sin stock
              </p>
              <p className="mt-2 text-[#111827] dark:text-white" style={{ fontSize: '28px', fontWeight: '600' }}>
                {loading ? '...' : `${lowStockCount} / ${outOfStockCount}`}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-md p-6 border border-[#E5E7EB] dark:border-[#374151]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#6B7280] dark:text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                Valor total inventario
              </p>
              <p className="mt-2 text-[#111827] dark:text-white" style={{ fontSize: '28px', fontWeight: '600' }}>
                ${loading ? '...' : totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-white dark:bg-[#1F2937] border-2 border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:outline-none focus:border-[#2563EB] transition-colors"
            style={{ fontSize: '14px' }}
          />
        </div>
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-white dark:bg-[#1F2937] border-2 border-[#E5E7EB] dark:border-[#374151] rounded-lg text-[#111827] dark:text-white focus:outline-none focus:border-[#2563EB] transition-colors"
            style={{ fontSize: '14px' }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div>
        <p className="text-[#6B7280] dark:text-[#9CA3AF] mb-4" style={{ fontSize: '14px' }}>
          {loading ? 'Cargando productos...' : `Mostrando ${filteredProducts.length} de ${products.length} productos`}
        </p>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
          </div>
        ) : (
          <AdminTable data={filteredProducts} columns={columns} />
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <p className="text-[#2563EB] dark:text-blue-400" style={{ fontSize: '14px' }}>
          💡 <strong>Tip:</strong> Haz clic en el número de stock para editarlo directamente. Presiona Enter para
          guardar o Escape para cancelar.
        </p>
      </div>
    </AdminLayout>
  );
}
