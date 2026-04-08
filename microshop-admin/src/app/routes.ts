import { createBrowserRouter } from 'react-router';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminOrders } from './pages/AdminOrders';
import { AdminIncidents } from './pages/AdminIncidents';
import { AdminInventory } from './pages/AdminInventory';

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, Component: Dashboard },
      { path: 'register', Component: Register },
      { path: 'login', Component: Login },
      { path: 'forgot-password', Component: ForgotPassword },
      { path: 'profile', Component: Profile },
      { path: 'admin/dashboard', Component: Dashboard },
      { path: 'admin/users', Component: AdminUsers },
      { path: 'admin/orders', Component: AdminOrders },
      { path: 'admin/incidents', Component: AdminIncidents },
      { path: 'admin/inventory', Component: AdminInventory },
    ],
  },
]);