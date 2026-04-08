import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { products } from '../data/products';

export function SellerProducts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const sellerProducts = products.filter((p) => p.sellerId === 1);

  const filteredProducts = sellerProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs" style={{ fontWeight: '500' }}>Sin stock</span>;
    }
    if (stock <= 10) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs" style={{ fontWeight: '500' }}>Stock bajo</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs" style={{ fontWeight: '500' }}>En stock</span>;
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    alert(`Producto ${productToDelete} eliminado`);
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[#111827]" style={{ fontSize: '28px', fontWeight: '700' }}>
            Mis productos
          </h1>
          <Link
            to="/seller/products/new"
            className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors flex items-center gap-2"
            style={{ fontSize: '14px', fontWeight: '500' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Agregar producto
          </Link>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7280]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent bg-white"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3 text-left text-[#111827] text-xs uppercase tracking-wider" style={{ fontWeight: '600' }}>
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-[#111827] text-xs uppercase tracking-wider" style={{ fontWeight: '600' }}>
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-[#111827] text-xs uppercase tracking-wider" style={{ fontWeight: '600' }}>
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-[#111827] text-xs uppercase tracking-wider" style={{ fontWeight: '600' }}>
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-[#111827] text-xs uppercase tracking-wider" style={{ fontWeight: '600' }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#E5E7EB' }}
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <path d="M21 15l-5-5L5 21" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[#111827]" style={{ fontWeight: '500' }}>
                            {product.name}
                          </p>
                          <p className="text-[#6B7280] text-sm">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#111827]" style={{ fontWeight: '500' }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-[#111827]">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      {getStockBadge(product.stock)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/seller/products/${product.id}/edit`)}
                          className="p-2 text-[#2563EB] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto mb-4 w-16 h-16 text-[#9CA3AF]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-[#6B7280]">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-[#111827] mb-3" style={{ fontSize: '18px', fontWeight: '600' }}>
              ¿Eliminar producto?
            </h3>
            <p className="text-[#6B7280] mb-6">
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 transition-colors"
                style={{ fontSize: '14px', fontWeight: '500' }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                style={{ fontSize: '14px', fontWeight: '500' }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
