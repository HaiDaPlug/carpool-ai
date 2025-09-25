import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from '@vercel/speed-insights/react';

import './styles.css';
import Landing from './pages/Landing';
import Account from './pages/Account';
import AuthTest from './pages/AuthTest';
import { AuthProvider } from './contexts/AuthContext'; // ADD THIS

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/account', element: <Account /> },
  { path: '/auth-test', element: <AuthTest /> }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 }
  }
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider> {/* ADD THIS WRAPPER */}
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <SpeedInsights />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);