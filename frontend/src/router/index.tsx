import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage'; // Import LoginPage
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardPage from '../pages/DashboardPage';
import VozilaOpremaPage from '../pages/VozilaOpremaPage';
import ServisniNaloziPage from '../pages/ServisniNaloziPage';
import FirmePage from '../pages/FirmePage';
import LokacijaPage from '../pages/LokacijaPage';
import KorisniciPage from '../pages/KorisniciPage';

// Ovdje ćemo kasnije dodati layout-e i stranice
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />, // Redirect root to dashboard
  },
  {
    path: '/login',
    element: <LoginPage />, // Koristi LoginPage komponentu
  },
  {
    path: '/',
    element: <ProtectedRoute />, // Protected route wrapper
    children: [
      {
        path: 'dashboard',
        element: <DashboardLayout />, // Dashboard layout for all protected routes
        children: [
          {
            index: true, // This makes it the default route for /dashboard
            element: <DashboardPage />,
          },
          // Empty placeholders for future CRUD pages
          {
            path: 'vozila-oprema',
            element: <VozilaOpremaPage />,
          },
          {
            path: 'servisni-nalozi',
            element: <ServisniNaloziPage />,
          },
          {
            path: 'firme',
            element: <FirmePage />,
          },
          {
            path: 'lokacije',
            element: <LokacijaPage />,
          },
          {
            path: 'korisnici',
            element: <KorisniciPage />,
          },
        ],
      },
    ],
  },
  // 404 route
  {
    path: '*',
    element: <div className="p-12 text-center"><h1 className="text-3xl font-bold">404 - Stranica nije pronađena</h1></div>,
  },
]);

export const AppRouter = () => <RouterProvider router={router} />; 