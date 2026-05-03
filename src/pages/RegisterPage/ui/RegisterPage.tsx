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

import "./registerPage.scss";

const registerSchema = z
    .object({
        lastName: z.string().min(1, "Введіть прізвище"),
        firstName: z.string().min(1, "Введіть ім'я"),
        email: z.string().email("Невірний формат електронної пошти"),
        password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
        confirmPassword: z.string().min(1, "Підтвердіть пароль"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Паролі не збігаються",
        path: ["confirmPassword"],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((s) => s.setAuth);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        try {
            const response = await authApi.register(
                data.email,
                data.password,
                data.firstName,
                data.lastName,
            );
            setAuth(response.user, response.accessToken);
            navigate(ROUTES.LOGIN);
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ??
                "Помилка реєстрації. Спробуйте ще раз.";
            setServerError(message);
        }
    };

    return (
        <section className="register">
            <div className="register__content">
                <div className="register__header">
                    <div className="logo-container">
                        <img
                            className="register__logo"
                            src={logoUrl}
                            alt="Controla logo"
                        />
                        <h1 className="header__title">Controla</h1>
                    </div>
                </div>

                <div>
                    <h2 className="register__subtitle">
                        Керуйте командою без хаосу
                    </h2>
                </div>

                <form
                    className="register__form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <Input
                        placeholder="Прізвище"
                        error={errors.lastName?.message}
                        {...register("lastName")}
                    />
                    <Input
                        placeholder="Ім'я"
                        error={errors.firstName?.message}
                        {...register("firstName")}
                    />
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
                    <PasswordInput
                        placeholder="Підтвердження пароля"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword")}
                    />

                    {serverError && (
                        <p className="register__error">{serverError}</p>
                    )}

                    <button
                        className="register__button"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
                    </button>
                </form>

                <div className="register__divider">АБО</div>

                <button className="register__google" type="button">
                    <img src={googleIconUrl} alt="Google" />
                    Зареєструватися через Google
                </button>

                <p className="register__footer">
                    Вже маєте акаунт? <a href="/login">Увійти</a>
                </p>
            </div>
        </section>
    );
};
