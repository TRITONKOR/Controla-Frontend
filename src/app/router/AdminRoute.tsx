import { useAuthStore } from "@/app/store/authStore";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "./routes";

interface AdminRouteProps {
    children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);

    if (!user || !accessToken) {
        return <Navigate to={ROUTES.GREETING} replace />;
    }

    if (user.role !== "ADMIN") {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
};
