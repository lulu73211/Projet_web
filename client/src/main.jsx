import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router";

import './index.css'
import App from './App.jsx'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/salut",
        element: <div>Hello World</div>,
    },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
