import { useAuthStore } from "@/app/store/authStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routes";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);

    if (!user || !accessToken) {
        return <Navigate to={ROUTES.GREETING} replace />;
    }

    if (user.role === "PENDING") {
        return <Navigate to={ROUTES.PENDING_APPROVAL} replace />;
    }

    return <>{children}</>;
};
