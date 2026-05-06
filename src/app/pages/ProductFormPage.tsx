import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { ProductForm } from '../components/catalog/ProductForm';
import { catalogService, Product } from '../services/catalogService';

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEdit || !id) return;
      try {
        setLoading(true);
        const data = await catalogService.getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError('Producto no encontrado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, isEdit]);

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

  if (isEdit && error) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <p className="text-[#6B7280]">{error}</p>
          <button
            onClick={() => navigate('/seller/products')}
            className="mt-4 text-[#2563EB] hover:underline"
          >
            Volver a mis productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <ProductForm
          mode={isEdit ? 'edit' : 'create'}
          productId={id ? Number(id) : undefined}
          initialData={
            product
              ? {
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  category: product.category,
                  stock: product.stock
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
