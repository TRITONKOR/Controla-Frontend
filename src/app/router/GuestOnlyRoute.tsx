import { useAuthStore } from "@/app/store/authStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routes";

interface GuestOnlyRouteProps {
    children: ReactNode;
}

export const GuestOnlyRoute = ({ children }: GuestOnlyRouteProps) => {
    const { user, accessToken, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return <div>Завантаження...</div>;
    }

    if (user && accessToken) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
};
