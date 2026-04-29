import { createBrowserRouter } from 'react-router';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { SellerProducts } from './pages/SellerProducts';
import { ProductFormPage } from './pages/ProductFormPage';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';


export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, Component: SellerProducts },
      { path: 'register', Component: Register },
      { path: 'login', Component: Login },
      { path: 'forgot-password', Component: ForgotPassword },
      { path: 'verify-email', Component: VerifyEmail },
      { path: 'reset-password', Component: ResetPassword },

      { path: 'profile', Component: Profile },
      { path: 'seller/products', Component: SellerProducts },
      { path: 'seller/products/new', Component: ProductFormPage },
      { path: 'seller/products/:id/edit', Component: ProductFormPage },
      { path: 'orders', Component: Orders },
      { path: 'orders/:id', Component: OrderDetail },
    ],
  },
]);