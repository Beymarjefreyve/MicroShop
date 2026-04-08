import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { PrimaryButton } from '../auth/PrimaryButton';

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
  };
}

export function ProductForm({ mode, initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || '',
    stock: initialData?.stock || 0
  });

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: ''
  });

  const categories = ['Electrónica', 'Ropa', 'Hogar', 'Deportes', 'Libros'];

  const validateField = (name: string, value: string | number) => {
    let error = '';

    if (name === 'name' && !value) {
      error = 'El nombre es obligatorio';
    } else if (name === 'description' && !value) {
      error = 'La descripción es obligatoria';
    } else if (name === 'price' && Number(value) <= 0) {
      error = 'El precio debe ser mayor a 0';
    } else if (name === 'category' && !value) {
      error = 'Selecciona una categoría';
    } else if (name === 'stock' && Number(value) < 0) {
      error = 'El stock no puede ser negativo';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const isNameValid = validateField('name', formData.name);
    const isDescValid = validateField('description', formData.description);
    const isPriceValid = validateField('price', formData.price);
    const isCategoryValid = validateField('category', formData.category);
    const isStockValid = validateField('stock', formData.stock);

    if (!isNameValid || !isDescValid || !isPriceValid || !isCategoryValid || !isStockValid) {
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);

    setTimeout(() => {
      navigate('/seller/products');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
      <h2 className="text-[#111827] mb-6" style={{ fontSize: '24px', fontWeight: '600' }}>
        {mode === 'create' ? 'Crear producto' : 'Editar producto'}
      </h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm" style={{ fontWeight: '500' }}>
            Producto guardado correctamente
          </p>
        </div>
      )}

      <div className="space-y-5">
        {/* Nombre */}
        <div>
          <label className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
            Nombre del producto *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
              errors.name ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] resize-none ${
              errors.description ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Precio */}
          <div>
            <label className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
              Precio ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                errors.price ? 'border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
              Cantidad en stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                errors.stock ? 'border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
            Categoría *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
              errors.category ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
            Imágenes (máximo 4)
          </label>
          <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-8 text-center hover:border-[#2563EB] transition-colors cursor-pointer">
            <svg
              className="mx-auto mb-3 w-12 h-12 text-[#6B7280]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[#6B7280] text-sm">
              Haz clic para subir o arrastra las imágenes aquí
            </p>
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={() => navigate('/seller/products')}
          className="flex-1 py-2.5 border-2 border-[#E5E7EB] text-[#111827] rounded-lg hover:bg-gray-50 transition-colors"
          style={{ fontSize: '14px', fontWeight: '500' }}
        >
          Cancelar
        </button>
        <div className="flex-1">
          <PrimaryButton loading={loading} type="submit">
            Guardar producto
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
