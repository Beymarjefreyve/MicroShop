import { createContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import authService from '../services/authService';

export interface CartItem {
  id: number; // Item ID in cart-service
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'CLEAR_CART' };

interface CartContextType {
  state: CartState;
  addItem: (product: any, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOAD_CART':
      return { ...state, items: action.payload, loading: false };
    case 'CLEAR_CART':
      return { ...state, items: [], loading: false };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false });

  const fetchCart = useCallback(async () => {
    const user = authService.getUser();
    if (!user || !user.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await cartService.getCart(user.id);
      const mappedItems: CartItem[] = cart.items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.product_name,
        price: Number(item.price_at_addition),
        quantity: item.quantity,
        image: 'default', // Ideally backend returns image too
        category: 'General'
      }));
      dispatch({ type: 'LOAD_CART', payload: mappedItems });
    } catch (e) {
      console.error('Error fetching cart:', e);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = async (product: any, quantity: number = 1) => {
    const user = authService.getUser();
    if (!user || !user.id) {
      alert('Debes iniciar sesión para agregar al carrito');
      return;
    }

    try {
      await cartService.addItem(user.id, {
        id: product.id,
        name: product.name,
        price: product.price
      }, quantity);
      await fetchCart();
    } catch (e) {
      console.error('Error adding item:', e);
    }
  };

  const removeItem = async (itemId: number) => {
    const user = authService.getUser();
    if (!user || !user.id) return;

    try {
      await cartService.removeItem(user.id, itemId);
      await fetchCart();
    } catch (e) {
      console.error('Error removing item:', e);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    const user = authService.getUser();
    if (!user || !user.id || quantity < 1) return;

    try {
      await cartService.updateQuantity(user.id, itemId, quantity);
      await fetchCart();
    } catch (e) {
      console.error('Error updating quantity:', e);
    }
  };

  const clearCart = async () => {
    const user = authService.getUser();
    if (!user || !user.id) return;

    try {
      await cartService.clearCart(user.id);
      dispatch({ type: 'CLEAR_CART' });
    } catch (e) {
      console.error('Error clearing cart:', e);
    }
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };