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
  image?: string;
  images?: { id: number; image: string }[];
  reviews?: {
    id: number;
    user_id: number;
    user_name?: string;
    rating: number;
    comment: string;
    created_at?: string;
  }[];
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
          : data.images?.[0]?.image)),
      reviews: Array.isArray(data.reviews)
        ? data.reviews.map((review: any) => ({
          id: review.id,
          user_id: review.user_id,
          user_name: review.user_name || review.user || review.username,
          rating: Number(review.rating) || 0,
          comment: review.comment || '',
          created_at: review.created_at
        }))
        : []
    };
  },

  async rateProduct(id: number, rating: number, comment: string, user_id: number): Promise<any> {
    const response = await fetch(`${API_URL}/products/${id}/rate/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment, user_id }),
    });
    if (!response.ok) throw new Error('Failed to rate product');
    return response.json();
  }
};
