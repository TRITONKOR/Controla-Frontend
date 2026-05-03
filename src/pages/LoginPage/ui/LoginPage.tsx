import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { authApi } from "@/api/auth/auth";
import { ROUTES } from "@/app/router/routes";
import { useAuthStore } from "@/app/store/authStore";
import { Input } from "../../../shared/ui/AuthInput";
import { PasswordInput } from "../../../shared/ui/PasswordInput/ui/PasswordInput";

import googleIconUrl from "@/assets/google-icon.png";
import logoUrl from "@/assets/logo.png";

import "./loginPage.scss";

const loginSchema = z.object({
    email: z.string().email("Невірний формат електронної пошти"),
    password: z.string().min(1, "Введіть пароль"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError(null);
        try {
            const response = await authApi.login(data.email, data.password);
            console.log(response);
            setAuth(response.user, response.accessToken);
            navigate(ROUTES.DASHBOARD);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ??
                "Невірна електронна пошта або пароль.";
            setServerError(message);
        }
    };

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

                <form
                    className="login__form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <Input
                        placeholder="Електронна пошта"
                        type="email"
                        error={errors.email?.message}
                        {...register("email")}
                    />
                    <PasswordInput
                        placeholder="Пароль"
                        error={errors.password?.message}
                        {...register("password")}
                    />

                    {serverError && (
                        <p className="login__error">{serverError}</p>
                    )}

                    <button
                        className="login__button"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Вхід..." : "Увійти"}
                    </button>
                </form>

                <div className="login__divider">АБО</div>

                <button className="login__google" type="button">
                    <img src={googleIconUrl} alt="Google" />
                    Увійти через Google
                </button>

                <p className="login__footer">
                    Ще немає акаунта? <a href="/register">Зареєструватися</a>
                </p>
            </div>
        </section>
    );
};
