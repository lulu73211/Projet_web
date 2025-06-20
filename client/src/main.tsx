import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Sidebar from './components/Sidebar'
import PublicRoute from './components/PublicRoute'
import App from './App'
import Signup from './pages/Signup'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom"

const router = createBrowserRouter([
    {
        path: "/*",  // le App gère le login OU la page messagerie
        element: (
            <PublicRoute>
                <App />
            </PublicRoute>
        ),
    },
    {
        path: "/signup",
        element: (
            <PublicRoute>
                <Signup/>
            </PublicRoute>
        ),
    },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Sidebar/>
      <RouterProvider router={router} />
  </StrictMode>,
)
