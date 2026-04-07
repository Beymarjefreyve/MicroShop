import { createBrowserRouter } from 'react-router';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { SellerProducts } from './pages/SellerProducts';
import { ProductFormPage } from './pages/ProductFormPage';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { Confirmation } from './pages/Confirmation';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { Dashboard } from './pages/Dashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminOrders } from './pages/AdminOrders';
import { AdminIncidents } from './pages/AdminIncidents';
import { AdminInventory } from './pages/AdminInventory';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, Component: Catalog },
      { path: 'register', Component: Register },
      { path: 'login', Component: Login },
      { path: 'forgot-password', Component: ForgotPassword },
      { path: 'profile', Component: Profile },
      { path: 'catalog', Component: Catalog },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'seller/products', Component: SellerProducts },
      { path: 'seller/products/new', Component: ProductFormPage },
      { path: 'seller/products/:id/edit', Component: ProductFormPage },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'checkout/payment', Component: Payment },
      { path: 'checkout/confirmation', Component: Confirmation },
      { path: 'orders', Component: Orders },
      { path: 'orders/:id', Component: OrderDetail },
      { path: 'admin/dashboard', Component: Dashboard },
      { path: 'admin/users', Component: AdminUsers },
      { path: 'admin/orders', Component: AdminOrders },
      { path: 'admin/incidents', Component: AdminIncidents },
      { path: 'admin/inventory', Component: AdminInventory },
    ],
  },
]);