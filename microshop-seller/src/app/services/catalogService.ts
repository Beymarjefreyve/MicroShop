const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8002/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: number;
  category_name?: string;
  seller_id: number;
  seller_name?: string;
  average_rating?: number;
  images?: { id: number; image: string }[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  image: string;
  product: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const catalogService = {
  async getProducts(params?: Record<string, string>): Promise<PaginatedResponse<Product>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_URL}/products/${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    data.results = data.results.map((p: any) => ({
      ...p,
      price: parseFloat(p.price),
      images: p.images ? p.images.map((img: any) => ({
        ...img,
        image: img.image && !img.image.startsWith('http') 
          ? `${API_URL.replace('/api', '')}${img.image}` 
          : img.image
      })) : [],
      image: p.image && !p.image.startsWith('http')
        ? `${API_URL.replace('/api', '')}${p.image}`
        : (p.image || (p.images && p.images[0]?.image && !p.images[0].image.startsWith('http')
          ? `${API_URL.replace('/api', '')}${p.images[0].image}`
          : p.images?.[0]?.image))
    }));
    return data;
  },

  async getCategories(): Promise<PaginatedResponse<Category>> {
    const response = await fetch(`${API_URL}/categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    return { 
      ...data, 
      price: parseFloat(data.price),
      image: data.image && !data.image.startsWith('http')
        ? `${API_URL.replace('/api', '')}${data.image}`
        : (data.image || (data.images && data.images[0]?.image && !data.images[0].image.startsWith('http')
          ? `${API_URL.replace('/api', '')}${data.images[0].image}`
          : data.images?.[0]?.image)),
      images: data.images ? data.images.map((img: any) => ({
        ...img,
        image: img.image && !img.image.startsWith('http')
          ? `${API_URL.replace('/api', '')}${img.image}`
          : img.image
      })) : []
    };
  },

  async getProductImages(productId: number): Promise<ProductImage[]> {
    const response = await fetch(`${API_URL}/product-images/?product=${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product images');
    const data = await response.json();
    const results = Array.isArray(data) ? data : (data.results || []);
    return results.map((img: any) => ({
      ...img,
      image: img.image && !img.image.startsWith('http')
        ? `${API_URL.replace('/api', '')}${img.image}`
        : img.image
    }));
  },

  async createProduct(productData: any): Promise<Product> {
    const isFormData = productData instanceof FormData;
    const response = await fetch(`${API_URL}/products/`, {
      method: 'POST',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? productData : JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to create product');
    const data = await response.json();
    return { 
      ...data, 
      price: parseFloat(data.price),
      images: data.images ? data.images.map((img: any) => ({
        ...img,
        image: img.image && !img.image.startsWith('http') 
          ? `${API_URL.replace('/api', '')}${img.image}` 
          : img.image
      })) : [],
      image: data.image && !data.image.startsWith('http')
        ? `${API_URL.replace('/api', '')}${data.image}`
        : (data.image || (data.images && data.images[0]?.image && !data.images[0].image.startsWith('http')
          ? `${API_URL.replace('/api', '')}${data.images[0].image}`
          : data.images?.[0]?.image))
    };
  },

  async updateProduct(id: number, productData: any): Promise<Product> {
    const isFormData = productData instanceof FormData;
    const response = await fetch(`${API_URL}/products/${id}/`, {
      method: 'PATCH',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? productData : JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(JSON.stringify(errorData) || 'Failed to update product');
    }
    const data = await response.json();
    return { 
      ...data, 
      price: parseFloat(data.price),
      images: data.images ? data.images.map((img: any) => ({
        ...img,
        image: img.image && !img.image.startsWith('http') 
          ? `${API_URL.replace('/api', '')}${img.image}` 
          : img.image
      })) : [],
      image: data.image && !data.image.startsWith('http')
        ? `${API_URL.replace('/api', '')}${data.image}`
        : (data.image || (data.images && data.images[0]?.image && !data.images[0].image.startsWith('http')
          ? `${API_URL.replace('/api', '')}${data.images[0].image}`
          : data.images?.[0]?.image))
    };
  },

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },

  async deleteProductImage(_productId: number, imageId: number): Promise<void> {
    const response = await fetch(`${API_URL}/product-images/${imageId}/`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete product image');
  }
};
