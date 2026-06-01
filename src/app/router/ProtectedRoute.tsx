import { useAuthStore } from "@/app/store/authStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routes";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, accessToken, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return <div>Завантаження...</div>;
    }

    if (!user || !accessToken) {
        return <Navigate to={ROUTES.GREETING} replace />;
    }

    if (user.role === "PENDING") {
        return <Navigate to={ROUTES.PENDING_APPROVAL} replace />;
    }

    if (user.role === "ADMIN") {
        return <Navigate to={ROUTES.ADMIN} replace />;
    }

    return <>{children}</>;
};
