export const API_CONFIG = {
  AUTH_URL: import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8001',
  NOTIFICATION_URL: import.meta.env.VITE_NOTIFICATION_API_URL || 'http://localhost:8007',
  CATALOG_URL: import.meta.env.VITE_CATALOG_URL || 'http://localhost:8002/api',
  RECOMMENDATION_URL: import.meta.env.VITE_RECOMMENDATION_API_URL || 'http://localhost:8009/api/recommendations',
};

