import logoUrl from "@/assets/logo.png";

import { authApi } from "@/api";
import { ROUTES } from "@/app/router/routes";
import { useAuthStore } from "@/app/store/authStore";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { useNavigate } from "react-router";
import "./header.scss";

export const Header = () => {
    const clearAuth = useAuthStore((s) => s.clearAuth);

    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);

    const handleProfileClick = async () => {
        //navigate(ROUTES.DASHBOARD);

        // temporary
        try {
            await authApi.logout();
        } finally {
            clearAuth();
            navigate(ROUTES.LOGIN);
        }
    };

    return (
        <header className="header">
            <div className="logo-container">
                <img
                    className="header__logo"
                    src={logoUrl}
                    alt="Controla logo"
                />
                <h1 className="header__title">Controla</h1>
            </div>
            <div className="navigation"></div>
            <div className="profile">
                {user ? (
                    <UserAvatar user={user} onClick={handleProfileClick} />
                ) : (
                    <button
                        className="login-button"
                        onClick={() => navigate(ROUTES.LOGIN)}
                    >
                        Спробувати
                    </button>
                )}
            </div>
        </header>
    );
};
