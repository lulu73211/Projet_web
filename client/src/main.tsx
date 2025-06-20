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
import ChatApp from "@/pages/ChatPage.tsx";
import PrivateLayout from "@/components/PrivateLayout.tsx";
import PrivateRoute from "@/components/PrivateRoute.tsx";

const router = createBrowserRouter([
    {
        path: "/signup",
        element: (
            <PublicRoute>
                <Signup />
            </PublicRoute>
        ),
    },
    {
        path: "/login",
        element: (
            <PublicRoute>
                <LoginPage />
            </PublicRoute>
        ),
    },
    {
        element: (
            <PrivateRoute>
                <PrivateLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: "/",
                element: <ChatApp />,
            },
        ],
    },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
