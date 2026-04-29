import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import authService from './services/authService';

export default function App() {
  useEffect(() => {
    const validate = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          await authService.validateToken(token);
        } catch (error) {
          console.error('Token validation failed:', error);
          authService.clearAuthData();
          // Optionally redirect to login, but since most routes might be public 
          // or handle their own auth check, we just clear the data.
        }
      }
    };
    validate();
  }, []);

  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}