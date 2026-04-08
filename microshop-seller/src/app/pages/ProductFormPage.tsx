import { useParams, useNavigate } from 'react-router';
import { Navbar } from '../components/shared/Navbar';
import { ProductForm } from '../components/catalog/ProductForm';
import { products } from '../data/products';

export function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const product = isEdit ? products.find((p) => p.id === Number(id)) : null;

  if (isEdit && !product) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        <Navbar />
        <div className="pt-24 px-4 text-center">
          <p className="text-[#6B7280]">Producto no encontrado</p>
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
