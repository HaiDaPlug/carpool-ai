import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles.css'
import Landing from './pages/Landing'
import Account from './pages/Account'
const router = createBrowserRouter([
{ path: '/', element: <Landing /> },
{ path: '/account', element: <Account /> }
])
createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<RouterProvider router={router} />
</React.StrictMode>
)
