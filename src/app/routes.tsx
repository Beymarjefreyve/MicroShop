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
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';
import { SelectRole } from './pages/SelectRole';
import { AdminRoute, ClientRoute } from './components/shared/RouteGuards';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      // Rutas públicas (sin autenticación requerida)
      { index: true, Component: Login },
      { path: 'register', Component: Register },
      { path: 'login', Component: Login },
      { path: 'select-role', Component: SelectRole },
      { path: 'forgot-password', Component: ForgotPassword },
      { path: 'verify-email', Component: VerifyEmail },
      { path: 'reset-password', Component: ResetPassword },

      // Rutas de clientes (BUYER / SELLER) — bloqueadas para ADMIN
      {
        path: 'profile',
        element: <ClientRoute><Profile /></ClientRoute>
      },
      {
        path: 'catalog',
        element: <ClientRoute><Catalog /></ClientRoute>
      },
      {
        path: 'product/:id',
        element: <ClientRoute><ProductDetail /></ClientRoute>
      },
      {
        path: 'seller/products',
        element: <ClientRoute><SellerProducts /></ClientRoute>
      },
      {
        path: 'seller/products/new',
        element: <ClientRoute><ProductFormPage /></ClientRoute>
      },
      {
        path: 'seller/products/:id/edit',
        element: <ClientRoute><ProductFormPage /></ClientRoute>
      },
      {
        path: 'cart',
        element: <ClientRoute><Cart /></ClientRoute>
      },
      {
        path: 'checkout',
        element: <ClientRoute><Checkout /></ClientRoute>
      },
      {
        path: 'orders/:id/pay',
        element: <ClientRoute><Payment /></ClientRoute>
      },
      {
        path: 'checkout/confirmation',
        element: <ClientRoute><Confirmation /></ClientRoute>
      },
      {
        path: 'orders',
        element: <ClientRoute><Orders /></ClientRoute>
      },
      {
        path: 'orders/:id',
        element: <ClientRoute><OrderDetail /></ClientRoute>
      },

      // Rutas de administrador — bloqueadas para no-ADMIN
      {
        path: 'admin/dashboard',
        element: <AdminRoute><Dashboard /></AdminRoute>
      },
      {
        path: 'admin/users',
        element: <AdminRoute><AdminUsers /></AdminRoute>
      },
      {
        path: 'admin/orders',
        element: <AdminRoute><AdminOrders /></AdminRoute>
      },
      {
        path: 'admin/incidents',
        element: <AdminRoute><AdminIncidents /></AdminRoute>
      },
      {
        path: 'admin/inventory',
        element: <AdminRoute><AdminInventory /></AdminRoute>
      },
      // AdminLogin ya no es necesario (se elimina la ruta expuesta)
    ],
  },
]);