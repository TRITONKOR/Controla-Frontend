import { authApi } from "@/api/auth";
import { ROUTES } from "@/app/router";
import { useAuthStore } from "@/app/store/authStore";
import waitingGif from "@/assets/pending-approval.gif";
import { userApi } from "@/entities/user";
import { useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import "./pendingApprovalPage.scss";

export const PendingApprovalPage: FC = () => {
    const user = useAuthStore((state) => state.user);
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return;

        const check = async () => {
            try {
                const response = await userApi.isApproved(user.id);
                if (response.isApproved && response.role !== "PENDING") {
                    const refreshed = await authApi.refresh();
                    setAuth(refreshed.user, refreshed.accessToken);
                    navigate(ROUTES.HOME, { replace: true });
                }
            } catch (error) {
                console.error(error);
            }
        };

        check();
        const interval = setInterval(check, 15_000);
        return () => clearInterval(interval);
    }, [user, setAuth, navigate]);

    return (
        <div className="pending-approval">
            <h1 className="pending-approval__title">
                Ваш акаунт очікує на схвалення
            </h1>
            <p className="pending-approval__message">
                Дякуємо за реєстрацію! Ваш акаунт наразі знаходиться на
                розгляді. Ми повідомимо вас, як тільки він буде схвалений.
            </p>
            <img
                className="pending-approval__gif"
                src={waitingGif}
                alt="Pending Approval"
            />
        </div>
    );
};
