import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PrimaryButton } from '../auth/PrimaryButton';
import { catalogService, Category } from '../../services/catalogService';
import authService from '../../services/authService';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: number;
  initialData?: {
    name: string;
    description: string;
    price: number;
    category: number | string;
    stock: number;
  };
}

export function ProductForm({ mode, productId, initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await catalogService.getCategories();
        setCategories(data.results);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

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
    setApiError(null);
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
    setApiError(null);

    try {
      const user = authService.getUser();
      const payload = {
        ...formData,
        seller: user?.id,
        // Backend usually expects category ID
        category: typeof formData.category === 'string' ? parseInt(formData.category) : formData.category
      };

      if (mode === 'create') {
        await catalogService.createProduct(payload);
      } else if (productId) {
        await catalogService.updateProduct(productId, payload);
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (err: any) {
      setApiError(err.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto border border-gray-100">
      <h2 className="text-[#111827] mb-6" style={{ fontSize: '24px', fontWeight: '600' }}>
        {mode === 'create' ? 'Crear producto' : 'Editar producto'}
      </h2>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-green-700 text-sm font-medium">Producto guardado correctamente. Redirigiendo...</p>
        </div>
      )}

      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {apiError}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-[#111827] mb-2 font-medium" style={{ fontSize: '14px' }}>
            Nombre del producto *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all ${
              errors.name ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-[#111827] mb-2 font-medium" style={{ fontSize: '14px' }}>
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all resize-none ${
              errors.description ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[#111827] mb-2 font-medium" style={{ fontSize: '14px' }}>
              Precio ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all ${
                errors.price ? 'border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-[#111827] mb-2 font-medium" style={{ fontSize: '14px' }}>
              Cantidad en stock *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all ${
                errors.stock ? 'border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[#111827] mb-2 font-medium" style={{ fontSize: '14px' }}>
            Categoría *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center] ${
              errors.category ? 'border-red-500' : 'border-[#E5E7EB]'
            }`}
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236B7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundSize: '1.5em' }}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Imágenes (Simplified for now) */}
        <div>
          <label className="block text-[#111827] mb-2 font-medium" style={{ fontSize: '14px' }}>
            Imágenes
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#2563EB] transition-colors cursor-pointer bg-gray-50/50">
            <svg className="mx-auto mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-gray-500 text-sm">Funcionalidad de subida próximamente</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button
          type="button"
          onClick={() => navigate('/seller/products')}
          className="flex-1 py-2.5 border-2 border-gray-100 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          style={{ fontSize: '14px' }}
        >
          Cancelar
        </button>
        <div className="flex-1">
          <PrimaryButton loading={loading} type="submit" className="shadow-lg shadow-blue-200">
            {mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
