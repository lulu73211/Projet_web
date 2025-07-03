import { Navigate } from "react-router";
import { useUserStore } from '../store/userStore.ts'
import type { ReactNode } from "react";
import { useMeQuery } from "@/generated/graphql";
import { useEffect } from "react";

interface PrivateRouteProps {
    children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);

    // Fait appel au hook généré par codegen pour /me
    const { data, loading, error } = useMeQuery({
        fetchPolicy: "network-only",
        onError: () => {
            console.log("Token invalide ou expiré, user non trouvé.");
        }
    });

    // Si /me renvoie un user, on le set dans Zustand
    useEffect(() => {
        if (data?.me) {
            console.log("✅ User récupéré via /me :", data.me);
            setUser({
                id: data.me.id,
                email: data.me.email,
                username: data.me.username
            });
        }
    }, [data, setUser]);

    console.log("👀 Zustand user:", user);

    if (loading) {
        return <div>Chargement...</div>;
    }

    // Si pas d'utilisateur connecté => redirige
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
