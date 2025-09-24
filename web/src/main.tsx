import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpeedInsights } from '@vercel/speed-insights/react';

import './styles.css';
import Landing from './pages/Landing';
import Account from './pages/Account';

const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  { path: '/account', element: <Account /> }
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 }
  }
});

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <SpeedInsights />
    </QueryClientProvider>
  </React.StrictMode>
);
