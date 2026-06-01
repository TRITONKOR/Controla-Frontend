import logoUrl from "@/assets/logo.png";

import { ROUTES } from "@/app/router/routes";
import { useAuthStore } from "@/app/store/authStore";
import { useProjectStore } from "@/entities/project";
import { UserAvatar } from "@/entities/user/ui/UserAvatar";
import { useNavigate } from "react-router";
import "./header.scss";

export const Header = () => {
    const setSelectedProject = useProjectStore((s) => s.setSelectedProject);

    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);

    const handleProfileClick = async () => {
        navigate(ROUTES.PROFILE);
    };

    const handleLogoClick = () => {
        setSelectedProject(null);
        navigate(ROUTES.PROJECTS);
    };

    return (
        <header className="header">
            <div className="logo-container">
                <img
                    onClick={handleLogoClick}
                    className="header__logo"
                    src={logoUrl}
                    alt="Контрола logo"
                />
                <h1 className="header__title">Контрола</h1>
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
