const API_URL = import.meta.env.VITE_ORDER_URL || 'http://localhost:8004/api/orders';

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price_at_purchase: number;
}

export interface OrderHistory {
    id: number;
    status: string;
    changed_at: string;
    comment: string;
}

export interface Order {
    id: number;
    user_id: number;
    status: string;
    total_amount: number;
    shipping_address: string;
    items: OrderItem[];
    history: OrderHistory[];
    created_at: string;
    updated_at: string;
}

export const orderService = {
    async getOrders(userId: number, params?: Record<string, string>): Promise<Order[]> {
        const queryParams = new URLSearchParams({ user_id: userId.toString(), ...params }).toString();
        const response = await fetch(`${API_URL}/?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        return Array.isArray(data) ? data : data.results;
    },

    async getAllOrders(params?: Record<string, string>): Promise<Order[]> {
        const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
        const response = await fetch(`${API_URL}/${queryString}`);
        if (!response.ok) throw new Error('Failed to fetch all orders');
        const data = await response.json();
        return Array.isArray(data) ? data : data.results;
    },

    async getOrderById(id: number): Promise<Order> {
        const response = await fetch(`${API_URL}/${id}/`);
        if (!response.ok) throw new Error('Failed to fetch order');
        return response.json();
    },

    async createOrder(orderData: { user_id: number; total_amount: number; shipping_address: string; items: any[] }): Promise<Order> {
        const response = await fetch(`${API_URL}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    async cancelOrder(id: number): Promise<Order> {
        const response = await fetch(`${API_URL}/${id}/cancel/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to cancel order');
        }
        return response.json();
    },

    async updateStatus(id: number, status: string, comment: string = ''): Promise<Order> {
        const response = await fetch(`${API_URL}/${id}/update_status/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, comment }),
        });
        if (!response.ok) throw new Error('Failed to update status');
        return response.json();
    }
};
