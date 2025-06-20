import { Navigate } from "react-router";
import { useUserStore } from '../store/userStore.ts'
import type { ReactNode } from "react";

interface PrivateRouteProps {
    children: ReactNode;
}

export default function PrivateRoute({children}: PrivateRouteProps) {
    const user = useUserStore((state) => state.user)
    console.log(user)
    return user ? children : <Navigate to="/login" replace />;
}
