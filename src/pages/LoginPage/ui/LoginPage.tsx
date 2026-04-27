import type { FC } from "react";

import { Input } from "../../../shared/ui/AuthInput";
import { PasswordInput } from "../../../shared/ui/PasswordInput/ui/PasswordInput";

import googleIconUrl from "@/assets/google-icon.png";
import logoUrl from "@/assets/logo.png";

import "./loginPage.scss";

export const LoginPage: FC = () => {
    return (
        <section className="login">
            <div className="login__content">
                <div className="login__header">
                    <div className="logo-container">
                        <img
                            className="header__logo"
                            src={logoUrl}
                            alt="Controla logo"
                        />
                        <h1 className="header__title">Controla</h1>
                    </div>
                </div>

                <div>
                    <h2 className="login__subtitle">
                        Керуйте командою без хаосу
                    </h2>
                </div>

                <form className="login__form">
                    <Input placeholder="Електронна пошта" />
                    <PasswordInput placeholder="Пароль" />
                    <button className="login__button" type="submit">
                        Увійти
                    </button>
                </form>

                <div className="login__divider">АБО</div>

                <button className="login__google" type="button">
                    <img src={googleIconUrl} alt="Google" />
                    Увійти через Google
                </button>

                <p className="login__footer">
                    Вже маєте акаунт? <a href="/login">Увійти</a>
                </p>
            </div>
        </section>
    );
};
