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
  seller_name?: string; // Note: API might need to be adjusted or we map this
  average_rating?: number;
  created_at?: string;
  updated_at?: string;
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
    // API returns price as string, convert to number
    data.results = data.results.map((p: any) => ({
      ...p,
      price: parseFloat(p.price)
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
    return { ...data, price: parseFloat(data.price) };
  },

  async updateProduct(id: number, productData: any): Promise<Product> {
    const isFormData = productData instanceof FormData;
    const response = await fetch(`${API_URL}/products/${id}/`, {
      method: 'PATCH',
      headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
      body: isFormData ? productData : JSON.stringify(productData),
    });
    if (!response.ok) throw new Error('Failed to update product');
    const data = await response.json();
    return { ...data, price: parseFloat(data.price) };
  },

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/products/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete product');
  }
};
