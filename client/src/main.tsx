import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Sidebar from './components/Sidebar'
import PublicRoute from './components/PublicRoute'
// import PrivateRoute from './components/PrivateRoute'

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <PublicRoute>
                <Login />
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
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Sidebar/>
      <RouterProvider router={router} />
  </StrictMode>,
)
