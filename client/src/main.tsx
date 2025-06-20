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
} from "react-router"
import LoginPage from "@/pages/LoginPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",  // le App gère le login OU la page messagerie
        element: <App/>,
    },
    {
        path: "/signup",
        element: (
            <PublicRoute>
                <Signup/>
            </PublicRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage/>
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
