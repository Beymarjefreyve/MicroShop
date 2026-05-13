import { createContext, useReducer, ReactNode, useEffect, useCallback, useState } from 'react';
import { cartService } from '../services/cartService';
import authService from '../services/authService';
import { catalogService } from '../services/catalogService';

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

interface CartContextType {
  state: CartState;
  addItem: (product: any, quantity?: number) => Promise<void>;
  removeItem: (itemId: number, isCheckout?: boolean) => Promise<void>;
  removeSelectedItems: (itemIds: number[], isCheckout?: boolean) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: (isCheckout?: boolean) => Promise<void>;
  getTotalItems: () => number;
  getSubtotal: () => number;
  isActionLoading: boolean;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'CLEAR_CART' };

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
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    const user = authService.getUser();
    if (!user || !user.id) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await cartService.getCart(user.id);
      
      let catalogProducts: any[] = [];
      try {
        const productsResponse = await catalogService.getProducts();
        catalogProducts = productsResponse.results || [];
      } catch (err) {
        console.error('Failed to load catalog products for cart', err);
      }

      const mappedItems: CartItem[] = cart.items.map(item => {
        const productData = catalogProducts.find(p => p.id === item.product_id);
        return {
          id: item.id,
          product_id: item.product_id,
          name: item.product_name,
          price: Number(item.price_at_addition),
          quantity: item.quantity,
          image: productData?.image || 'default',
          category: productData?.category_name || 'General'
        };
      });
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

    setIsActionLoading(true);
    try {
      await cartService.addItem(user.id, {
        id: product.id,
        name: product.name,
        price: product.price
      }, quantity);
      await fetchCart();
    } catch (e: any) {
      console.error('Error adding item:', e);
      alert(e.message || 'Error al agregar al carrito');
    } finally {
      setIsActionLoading(false);
    }
  };

  const removeItem = async (itemId: number, isCheckout: boolean = false) => {
    const user = authService.getUser();
    if (!user || !user.id) return;

    setIsActionLoading(true);
    try {
      await cartService.removeItem(user.id, itemId, isCheckout);
      await fetchCart();
    } catch (e: any) {
      console.error('Error removing item:', e);
      alert(e.message || 'Error al eliminar el producto');
    } finally {
      setIsActionLoading(false);
    }
  };

  const removeSelectedItems = async (itemIds: number[], isCheckout: boolean = false) => {
    const user = authService.getUser();
    if (!user || !user.id) return;

    setIsActionLoading(true);
    try {
      await cartService.bulkRemoveItems(user.id, itemIds, isCheckout);
      await fetchCart();
    } catch (e: any) {
      console.error('Error removing selected items:', e);
      alert(e.message || 'Error al eliminar productos');
    } finally {
      setIsActionLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    const user = authService.getUser();
    if (!user || !user.id) return;
    
    // Si la cantidad es 0, el backend lo manejará borrando y restaurando stock
    if (quantity < 0) return;

    setIsActionLoading(true);
    try {
      await cartService.updateQuantity(user.id, itemId, quantity);
      await fetchCart();
    } catch (e: any) {
      console.error('Error updating quantity:', e);
      alert(e.message || 'Error al actualizar cantidad');
    } finally {
      setIsActionLoading(false);
    }
  };

  const clearCart = async (isCheckout: boolean = false) => {
    const user = authService.getUser();
    if (!user || !user.id) return;

    setIsActionLoading(true);
    try {
      await cartService.clearCart(user.id, isCheckout);
      dispatch({ type: 'CLEAR_CART' });
    } catch (e: any) {
      console.error('Error clearing cart:', e);
      alert(e.message || 'Error al vaciar el carrito');
    } finally {
      setIsActionLoading(false);
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
    removeSelectedItems,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    isActionLoading
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export { CartContext };