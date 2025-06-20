import { Navigate } from "react-router";
import { useUserStore } from '../store/userStore.ts'
import type { ReactNode } from "react";

interface PublicRouteProps {
    children: ReactNode;
}

export default function PublicRoute({children} : PublicRouteProps) {
    const user = useUserStore((state) => state.user)

    return user ? <Navigate to="/" replace /> : children;
}
