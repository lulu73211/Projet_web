import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { ApolloProvider } from "@apollo/client";
import { client } from "./apolloClient"; // assure toi qu’il existe et configure ton link+auth

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router"

import PublicRoute from './components/PublicRoute'
import Signup from './pages/Signup'
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
        path : "/",
        element: (
            <PrivateRoute>
                <PrivateLayout />
            </PrivateRoute>
        ),
        children: [
            {
                path: "/chat/:chatId?",
                element: <ChatApp />,
            },
        ],
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ApolloProvider client={client}>
            <RouterProvider router={router} />
        </ApolloProvider>
    </StrictMode>
)
