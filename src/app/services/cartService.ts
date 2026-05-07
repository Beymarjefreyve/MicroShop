const API_URL = import.meta.env.VITE_CART_URL || 'http://localhost:8005/api/cart';

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
        if (!response.ok) throw new Error('Failed to fetch cart');
        return response.json();
    },

    async addItem(userId: number, product: { id: number; name: string; price: number }, quantity: number = 1): Promise<Cart> {
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
        if (!response.ok) throw new Error('Failed to add item to cart');
        return response.json();
    },

    async updateQuantity(userId: number, itemId: number, quantity: number): Promise<Cart> {
        const response = await fetch(`${API_URL}/update_quantity/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                item_id: itemId,
                quantity: quantity
            }),
        });
        if (!response.ok) throw new Error('Failed to update quantity');
        return response.json();
    },

    async removeItem(userId: number, itemId: number): Promise<Cart> {
        const response = await fetch(`${API_URL}/remove_item/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                item_id: itemId
            }),
        });
        if (!response.ok) throw new Error('Failed to remove item');
        return response.json();
    },

    async bulkRemoveItems(userId: number, itemIds: number[]): Promise<Cart> {
        const response = await fetch(`${API_URL}/bulk_remove/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                item_ids: itemIds
            }),
        });
        if (!response.ok) throw new Error('Failed to bulk remove items');
        return response.json();
    },

    async clearCart(userId: number): Promise<Cart> {
        const response = await fetch(`${API_URL}/clear/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
        });
        if (!response.ok) throw new Error('Failed to clear cart');
        return response.json();
    }
};
