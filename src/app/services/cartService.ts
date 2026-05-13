// Usar 127.0.0.1 para evitar problemas de resolución de 'localhost' en algunos navegadores/Windows
const API_URL = import.meta.env.VITE_CART_URL || 'http://127.0.0.1:8005/api/cart';

export interface CartItem {
    id: number;
    product_id: number;
    product_name: string;
    price_at_addition: number;
    quantity: number;
    subtotal: number;
}

export interface Cart {
    id: number;
    user_id: number;
    items: CartItem[];
    total_price: number;
    total_items: number;
    created_at: string;
    updated_at: string;
}

export const cartService = {
    async getCart(userId: number): Promise<Cart> {
        const response = await fetch(`${API_URL}/?user_id=${userId}`);
        if (!response.ok) throw new Error('No se pudo cargar el carrito');
        return response.json();
    },

    async addItem(userId: number, product: { id: number; name: string; price: number }, quantity: number = 1): Promise<Cart> {
        try {
            const response = await fetch(`${API_URL}/add_item/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    product_id: product.id,
                    product_name: product.name,
                    price: product.price,
                    quantity: quantity
                }),
            });
            
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const error = await response.json();
                    throw new Error(error.error || 'Error al agregar al carrito');
                } else {
                    const text = await response.text();
                    throw new Error(`Error del servidor (${response.status}): ${text.substring(0, 50)}`);
                }
            }
            return response.json();
        } catch (error: any) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('No se pudo conectar con el servicio de carrito. Verifica que el servidor esté corriendo en el puerto 8005.');
            }
            throw error;
        }
    },

    async updateQuantity(userId: number, itemId: number, quantity: number): Promise<Cart> {
        try {
            const response = await fetch(`${API_URL}/update_quantity/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    item_id: itemId,
                    quantity: quantity
                }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'No hay suficiente stock disponible');
            }
            return response.json();
        } catch (error: any) {
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                throw new Error('Error de conexión con el servicio de carrito.');
            }
            throw error;
        }
    },

    async removeItem(userId: number, itemId: number, isCheckout: boolean = false): Promise<Cart> {
        const response = await fetch(`${API_URL}/remove_item/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                item_id: itemId,
                is_checkout: isCheckout
            }),
        });
        if (!response.ok) throw new Error('Error al eliminar el producto');
        return response.json();
    },

    async bulkRemoveItems(userId: number, itemIds: number[], isCheckout: boolean = false): Promise<Cart> {
        const response = await fetch(`${API_URL}/bulk_remove/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                item_ids: itemIds,
                is_checkout: isCheckout
            }),
        });
        if (!response.ok) throw new Error('Error al eliminar productos');
        return response.json();
    },

    async clearCart(userId: number, isCheckout: boolean = false): Promise<Cart> {
        const response = await fetch(`${API_URL}/clear/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, is_checkout: isCheckout }),
        });
        if (!response.ok) throw new Error('Error al vaciar el carrito');
        return response.json();
    }
};
