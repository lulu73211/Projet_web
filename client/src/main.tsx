import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Sidebar from './components/Sidebar'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Sidebar/>
      <RouterProvider router={router} />
  </StrictMode>,
)
