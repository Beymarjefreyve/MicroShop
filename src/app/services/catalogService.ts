import { API_CONFIG } from '@/config/api';
import authService from './authService';

const API_URL = API_CONFIG.CATALOG_URL;

const authHeaders = () => ({
  'Authorization': `Bearer ${authService.getToken()}`,
});

const authJsonHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authService.getToken()}`,
});

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
  image?: string;
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

const formatImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Prepend backend base URL to relative media paths
  const baseUrl = API_URL.replace('/api/catalog', '');
  return `${baseUrl}${url}`;
};

export const catalogService = {
  async getProducts(params?: Record<string, string>): Promise<PaginatedResponse<Product>> {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    const response = await fetch(`${API_URL}/products/${queryString}`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');

    const data = await response.json();

    // Handle both paginated ({results: [...]}) and non-paginated ([...]) responses
    const results = Array.isArray(data) ? data : (data.results || []);
    const count = Array.isArray(data) ? data.length : (data.count || results.length);

    const processedResults = results.map((p: any) => ({
      ...p,
      price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
      images: p.images ? p.images.map((img: any) => ({
        ...img,
        image: formatImageUrl(img.image)
      })) : [],
      image: formatImageUrl(p.image || (p.images && p.images[0]?.image))
    }));

    return {
      count: count,
      next: data.next || null,
      previous: data.previous || null,
      results: processedResults
    };
  },

  async getCategories(): Promise<PaginatedResponse<Category>> {
    const response = await fetch(`${API_URL}/categories/`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();

    const results = Array.isArray(data) ? data : (data.results || []);
    const count = Array.isArray(data) ? data.length : (data.count || results.length);

    return {
      count: count,
      next: data.next || null,
      previous: data.previous || null,
      results: results
    };
  },

  async getProductById(id: number): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}/`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product');
    const data = await response.json();
    return {
      ...data,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      images: data.images ? data.images.map((img: any) => ({
        ...img,
        image: formatImageUrl(img.image)
      })) : [],
      image: formatImageUrl(data.image || (data.images && data.images[0]?.image))
    };
  },

  async getProductImages(productId: number): Promise<ProductImage[]> {
    const response = await fetch(`${API_URL}/product-images/?product=${productId}`, {
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch product images');
    const data = await response.json();
    const results = Array.isArray(data) ? data : (data.results || []);
    return results.map((img: any) => ({
      ...img,
      image: formatImageUrl(img.image)
    }));
  },

  async createProduct(productData: any): Promise<Product> {
    const isFormData = productData instanceof FormData;
    const response = await fetch(`${API_URL}/products/`, {
      method: 'POST',
      headers: isFormData
        ? authHeaders()
        : authJsonHeaders(),
      body: isFormData ? productData : JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to create product');
    }
    const data = await response.json();
    return {
      ...data,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      images: data.images ? data.images.map((img: any) => ({
        ...img,
        image: formatImageUrl(img.image)
      })) : [],
      image: formatImageUrl(data.image || (data.images && data.images[0]?.image))
    };
  },

  async updateProduct(id: number, productData: any): Promise<Product> {
    const isFormData = productData instanceof FormData;
    const response = await fetch(`${API_URL}/products/${id}/`, {
      method: 'PATCH',
      headers: isFormData
        ? authHeaders()
        : authJsonHeaders(),
      body: isFormData ? productData : JSON.stringify(productData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update product');
    }
    const data = await response.json();
    return {
      ...data,
      price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
      images: data.images ? data.images.map((img: any) => ({
        ...img,
        image: formatImageUrl(img.image)
      })) : [],
      image: formatImageUrl(data.image || (data.images && data.images[0]?.image))
    };
  },

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },

  async deleteProductImage(_productId: number, imageId: number): Promise<void> {
    const response = await fetch(`${API_URL}/product-images/${imageId}/`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product image');
  }
};
