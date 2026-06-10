import { API_CONFIG } from '@/config/api';
import authService from './authService';
import { Product } from './catalogService';

const API_URL = API_CONFIG.RECOMMENDATION_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authService.getToken()}`,
});

export const recommendationService = {
  // Obtener recomendaciones por usuario
  async getRecommendationsByUser(userId: number): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
        headers: authHeaders(),
      });
      if (!response.ok) {
        console.warn(`Recomendaciones fallidas para usuario ${userId}: ${response.status}`);
        return [];
      }
      const data = await response.json();
      return Array.isArray(data) ? data.map((item: any) => ({
        id: item.productId,
        name: item.name || '',
        description: item.description || '',
        price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0),
        image: item.image || '',
        category: item.categoryId || 0,
        category_name: item.categoryName || '',
        stock: item.stock ?? undefined,
        seller_id: 1,
        average_rating: item.averageRating ?? (item.average_rating ?? undefined)
      })) : [];
    } catch (e) {
      console.error('Error cargando recomendaciones por usuario:', e);
      return [];
    }
  },

  // Obtener productos similares
  async getSimilarProducts(productId: number): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/similar/${productId}`, {
        headers: authHeaders(),
      });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data.map((item: any) => ({
        id: item.productId,
        name: item.name || '',
        description: item.description || '',
        price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0),
        image: item.image || '',
        category: item.categoryId || 0,
        category_name: item.categoryName || '',
        stock: item.stock ?? undefined,
        seller_id: 1,
        average_rating: item.averageRating ?? (item.average_rating ?? undefined)
      })) : [];
    } catch (e) {
      console.error('Error cargando productos similares:', e);
      return [];
    }
  },

  // Registrar visualización de producto
  async registerView(userId: number, productId: number, categoryId: number): Promise<void> {
    try {
      await fetch(`${API_URL}/views`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId, productId, categoryId }),
      });
    } catch (e) {
      console.error('Error al registrar visualización:', e);
    }
  },

  // Registrar compra completada — alimenta el motor de recomendaciones
  async registerPurchase(
    userId: number,
    orderId: number,
    items: { productId: number; quantity: number; categoryId?: number }[]
  ): Promise<void> {
    try {
      await fetch(`${API_URL}/purchases`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ userId, orderId, items }),
      });
    } catch (e) {
      // Silencioso — no interrumpir el flujo de pago si falla
      console.warn('No se pudo registrar la compra en recomendaciones:', e);
    }
  },

  // Búsqueda en lenguaje natural con Gemini AI
  async aiSearch(userId: number | null, prompt: string, limit = 10): Promise<{
    products: Product[];
    explanation: string;
    source: 'AI' | 'AI+HISTORY' | 'FALLBACK';
    queryId: number;
  }> {
    const response = await fetch(`${API_URL}/ai/search`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ userId, prompt, limit }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Error ${response.status} en búsqueda IA`);
    }
    const data = await response.json();
    const products: Product[] = (data.products || []).map((item: any) => ({
      id: item.productId,
      name: item.name || '',
      description: item.description || '',
      price: typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0),
      image: item.image || '',
      category: item.categoryId || 0,
      category_name: item.categoryName || '',
      stock: item.stock ?? undefined,
      average_rating: item.averageRating ?? (item.average_rating ?? undefined),
    }));
    return {
      products,
      explanation: data.explanation || '',
      source: data.source || 'AI',
      queryId: data.queryId,
    };
  }
};
