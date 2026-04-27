import logoUrl from "@/assets/logo.png";

import "./header.scss";

export const Header = () => {
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
            <div className="profile"></div>
        </header>
    );
};
