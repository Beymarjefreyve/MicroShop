export const API_CONFIG = {
  AUTH_URL: import.meta.env.VITE_AUTH_API_URL || 'https://microservicio-1-auth-service.onrender.com',
  NOTIFICATION_URL: import.meta.env.VITE_NOTIFICATION_API_URL || 'https://microservicio-7-notification-service.onrender.com',
  CATALOG_URL: import.meta.env.VITE_CATALOG_URL || 'http://localhost:8002/api',
  CART_URL: import.meta.env.VITE_CART_URL || 'http://localhost:8003/api/cart',
  ORDER_URL: import.meta.env.VITE_ORDER_URL || 'http://localhost:8004/api/orders',
};
