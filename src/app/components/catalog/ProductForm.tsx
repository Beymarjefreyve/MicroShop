import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PrimaryButton } from '../auth/PrimaryButton';
import { catalogService, Category } from '../../services/catalogService';
import authService from '../../services/authService';
import noImage from '../../../assets/no-image.png';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: number;
  initialData?: {
    name: string;
    description: string;
    price: number;
    category: number | string;
    stock: number;
    images?: { id: number; image: string }[];
  };
}

export function ProductForm({ mode, productId, initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Nueva categoría inline
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState('');

  // Categorías adicionales seleccionadas (IDs)
  const [extraCategoryIds, setExtraCategoryIds] = useState<number[]>([]);
  
  const [existingImages, setExistingImages] = useState<{id: number, image: string}[]>(initialData?.images || []);
  const [newImages, setNewImages] = useState<File[]>([]);

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

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (name.length < 2) {
      setCategoryError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    // Verificar que no exista ya
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      const existing = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
      setFormData(prev => ({ ...prev, category: existing!.id }));
      setShowNewCategory(false);
      setNewCategoryName('');
      return;
    }

    setCategoryError('');
    setCreatingCategory(true);
    try {
      const CATALOG_API = import.meta.env.VITE_CATALOG_URL || 'http://localhost:8002/api';
      // Generar slug automático desde el nombre
      const slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      const resp = await fetch(`${CATALOG_API}/categories/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || err.slug?.[0] || 'Error al crear la categoría');
      }

      const created: Category = await resp.json();
      setCategories(prev => [...prev, created]);
      setFormData(prev => ({ ...prev, category: created.id }));
      setErrors(prev => ({ ...prev, category: '' }));
      setShowNewCategory(false);
      setNewCategoryName('');
    } catch (e: any) {
      setCategoryError(e.message || 'No se pudo crear la categoría');
    } finally {
      setCreatingCategory(false);
    }
  };

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
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description', formData.description);
      payload.append('price', formData.price.toString());
      payload.append('stock', formData.stock.toString());
      payload.append('category', typeof formData.category === 'string' ? formData.category : formData.category.toString());
      if (user?.id) {
        payload.append('seller_id', user.id.toString());
      }
      // Categorías adicionales
      extraCategoryIds.forEach(id => payload.append('extra_categories', id.toString()));
      
      newImages.forEach(file => {
        payload.append('images', file);
      });

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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[#111827] font-medium" style={{ fontSize: '14px' }}>
              Categoría *
            </label>
            <button
              type="button"
              onClick={() => { setShowNewCategory(v => !v); setCategoryError(''); setNewCategoryName(''); }}
              className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline font-medium"
            >
              {showNewCategory ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Cancelar
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Crear nueva categoría
                </>
              )}
            </button>
          </div>

          {/* Formulario inline para nueva categoría */}
          {showNewCategory && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-[#2563EB] font-medium mb-2">Nueva categoría</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={e => { setNewCategoryName(e.target.value); setCategoryError(''); }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())}
                  placeholder="Ej: Electrónica, Ropa, Deportes..."
                  className="flex-1 px-3 py-2 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 bg-white"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  disabled={creatingCategory || newCategoryName.trim().length < 2}
                  className="px-4 py-2 bg-[#2563EB] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {creatingCategory ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {creatingCategory ? 'Creando...' : 'Crear'}
                </button>
              </div>
              {categoryError && <p className="text-red-500 text-xs mt-1.5">{categoryError}</p>}
            </div>
          )}

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

        {/* Categorías adicionales */}
        {categories.length > 0 && (
          <div>
            <label className="block text-[#111827] mb-2 font-medium" style={{ fontSize: '14px' }}>
              Categorías adicionales
              <span className="ml-2 text-[#6B7280] font-normal text-xs">(opcional — selecciona varias)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories
                .filter(cat => String(cat.id) !== String(formData.category))
                .map(cat => {
                  const selected = extraCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setExtraCategoryIds(prev =>
                        selected ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                      )}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all text-left ${
                        selected
                          ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]'
                          : 'border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#2563EB] hover:text-[#2563EB]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {selected && (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
            </div>
            {extraCategoryIds.length > 0 && (
              <p className="text-xs text-[#6B7280] mt-2">
                {extraCategoryIds.length} categoría{extraCategoryIds.length !== 1 ? 's' : ''} adicional{extraCategoryIds.length !== 1 ? 'es' : ''} seleccionada{extraCategoryIds.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}

        {/* Imágenes */}
        <div>
          <label className="block text-[#111827] mb-2 font-medium" style={{ fontSize: '14px' }}>
            Imágenes (Máximo 4)
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {existingImages.map((img) => (
              <div key={`exist-${img.id}`} className="relative h-24 border rounded-lg overflow-hidden group bg-gray-50">
                <img 
                  src={img.image} 
                  alt="Producto" 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target as HTMLImageElement).src = noImage}
                />
                <button
                  type="button"
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={async () => {
                    try {
                      if (productId) {
                        await catalogService.deleteProductImage(productId, img.id);
                        setExistingImages(prev => prev.filter(i => i.id !== img.id));
                      }
                    } catch (e) {
                      console.error(e);
                      alert('Error eliminando imagen');
                    }
                  }}
                >
                  Eliminar
                </button>
              </div>
            ))}
            {newImages.map((file, i) => (
              <div key={`new-${i}`} className="relative h-24 border rounded-lg overflow-hidden group bg-gray-50">
                <img src={URL.createObjectURL(file)} alt="Nueva" className="w-full h-full object-cover" />
                <button
                  type="button"
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    setNewImages(prev => prev.filter((_, idx) => idx !== i));
                  }}
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>

          {(existingImages.length + newImages.length) < 4 && (
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#2563EB] transition-colors cursor-pointer bg-gray-50/50">
              <input
                type="file"
                multiple
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);
                    const slotsAvailable = 4 - (existingImages.length + newImages.length);
                    const filesToAdd = files.slice(0, slotsAvailable);
                    setNewImages(prev => [...prev, ...filesToAdd]);
                  }
                }}
              />
              <svg className="mx-auto mb-3 w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-gray-500 text-sm">Click para subir o arrastra imágenes aquí</p>
            </div>
          )}
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
