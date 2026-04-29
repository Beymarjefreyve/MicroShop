import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { PrimaryButton } from '../auth/PrimaryButton';
import { catalogService, Category } from '../../services/catalogService';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: number;
  initialData?: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
    images?: { id: number; image: string }[];
  };
}

export function ProductForm({ mode, productId, initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

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

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: number; image: string }[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);

  useEffect(() => {
    loadCategories();
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        category: initialData.category,
        stock: initialData.stock
      });
      setExistingImages(initialData.images || []);
      setRemovedImageIds([]);
      setSelectedFiles([]);
      setImagePreviews([]);
    }
  }, [initialData]);

  useEffect(() => {
    const loadExistingImages = async () => {
      if (mode !== 'edit' || !productId) return;
      try {
        const images = await catalogService.getProductImages(productId);
        setExistingImages(images.map(({ id, image }) => ({ id, image })));
      } catch (error) {
        console.error('Error loading product images:', error);
      }
    };

    loadExistingImages();
  }, [mode, productId]);

  const loadCategories = async () => {
    try {
      const response = await catalogService.getCategories();
      setCategories(response.results);
    } catch (error) {
      console.error('Error loading categories:', error);
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
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const filesArray = Array.from(files);
    const validFiles = filesArray.filter(file => file.type.startsWith('image/'));

    const availableSlots = 4 - (existingImages.length + selectedFiles.length);
    if (availableSlots <= 0) return;

    const filesToAdd = validFiles.slice(0, availableSlots);

    setSelectedFiles(prev => [...prev, ...filesToAdd]);

    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  const removeNewImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages(prev => prev.filter((img) => img.id !== imageId));
    setRemovedImageIds(prev => [...prev, imageId]);
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
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', String(formData.price));
      data.append('stock', String(formData.stock));
      data.append('category', formData.category);
      data.append('seller_id', '1'); // Mock seller_id 1
      
      selectedFiles.forEach(file => {
        data.append('images', file);
      });

      if (mode === 'edit' && productId && removedImageIds.length > 0) {
        await Promise.all(
          removedImageIds.map((imageId) => catalogService.deleteProductImage(productId, imageId))
        );
      }

      if (mode === 'create') {
        await catalogService.createProduct(data);
      } else if (mode === 'edit' && productId) {
        await catalogService.updateProduct(productId, data);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/seller/products');
      }, 1500);
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
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
              <option key={cat.id} value={cat.id.toString()}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-[#111827] mb-2" style={{ fontSize: '14px', fontWeight: '500' }}>
            Imágenes del producto (máximo 4)
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {existingImages.map((img) => (
              <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E7EB] group">
                <img src={img.image} alt={`Imagen actual ${img.id}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar imagen actual"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}

            {imagePreviews.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-[#E5E7EB] group">
                <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar imagen nueva"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {(existingImages.length + imagePreviews.length) < 4 && (
            <div 
              onClick={() => document.getElementById('image-input')?.click()}
              onDragOver={onDragOver}
              onDrop={onDrop}
              className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-8 text-center hover:border-[#2563EB] transition-colors cursor-pointer group"
            >
              <input
                id="image-input"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
              <svg
                className="mx-auto mb-3 w-12 h-12 text-[#6B7280] group-hover:text-[#2563EB] transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-[#6B7280] text-sm group-hover:text-[#2563EB] transition-colors">
                Haz clic para subir o arrastra las imágenes aquí
              </p>
              <p className="text-[#9CA3AF] text-xs mt-1">PNG, JPG hasta 10MB</p>
            </div>
          )}
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
