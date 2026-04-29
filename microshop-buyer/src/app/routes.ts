import { createBrowserRouter } from 'react-router';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Payment } from './pages/Payment';
import { Confirmation } from './pages/Confirmation';
import { Orders } from './pages/Orders';
import { OrderDetail } from './pages/OrderDetail';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';


export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, Component: Catalog },
      { path: 'register', Component: Register },
      { path: 'login', Component: Login },
      { path: 'forgot-password', Component: ForgotPassword },
      { path: 'verify-email', Component: VerifyEmail },
      { path: 'reset-password', Component: ResetPassword },

      { path: 'profile', Component: Profile },
      { path: 'catalog', Component: Catalog },
      { path: 'product/:id', Component: ProductDetail },
      { path: 'cart', Component: Cart },
      { path: 'checkout', Component: Checkout },
      { path: 'checkout/payment', Component: Payment },
      { path: 'checkout/confirmation', Component: Confirmation },
      { path: 'orders', Component: Orders },
      { path: 'orders/:id', Component: OrderDetail },
    ],
  },
]);