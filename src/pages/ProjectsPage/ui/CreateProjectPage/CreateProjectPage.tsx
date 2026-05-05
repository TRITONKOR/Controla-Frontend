import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { useAuthStore } from "@/app/store/authStore";
import { projectApi } from "@/entities/project/api/project";
import { Input } from "@/shared/ui/AuthInput";
import { DatePicker } from "@/shared/ui/DatePicker";
import { Modal } from "@/shared/ui/Modal";

import "./createProjectPage.scss";

const createProjectSchema = z.object({
    title: z
        .string()
        .min(3, "Назва повинна містити щонайменше 3 символи")
        .max(100, "Назва не може перевищувати 100 символів"),
    description: z
        .string()
        .min(10, "Опис повинен містити щонайменше 10 символів")
        .max(1000, "Опис не може перевищувати 1000 символів"),
    costs: z
        .string()
        .min(1, "Вкажіть вартість")
        .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
            message: "Вартість повинна бути додатнім числом",
        }),
    deadline: z
        .string()
        .min(1, "Вкажіть дедлайн")
        .refine((v) => new Date(v) > new Date(), {
            message: "Дедлайн повинен бути у майбутньому",
        }),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

interface CreateProjectPageProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const CreateProjectPage = ({
    isOpen,
    onClose,
    onSuccess,
}: CreateProjectPageProps) => {
    const user = useAuthStore((s) => s.user);
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),
    });

    const handleClose = () => {
        reset();
        setServerError(null);
        onClose();
    };

    const onSubmit = async (data: CreateProjectFormData) => {
        if (!user) return;
        setServerError(null);
        try {
            await projectApi.createProject({
                title: data.title,
                description: data.description,
                costs: Number(data.costs),
                deadline: data.deadline + "T00:00:00",
            });
            reset();
            onSuccess?.();
            onClose();
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ??
                "Помилка при створенні проєкту";
            setServerError(message);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Створити проєкт">
            <form
                className="create-project__form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <Input
                    label="Назва проєкту"
                    placeholder="Введіть назву проєкту"
                    error={errors.title?.message}
                    {...register("title")}
                />

                <div className="create-project__field">
                    <label className="create-project__label">Опис</label>
                    <textarea
                        className={`create-project__textarea${
                            errors.description
                                ? " create-project__textarea--error"
                                : ""
                        }`}
                        placeholder="Введіть опис проєкту"
                        rows={4}
                        {...register("description")}
                    />
                    {errors.description && (
                        <span className="create-project__error">
                            {errors.description.message}
                        </span>
                    )}
                </div>

                <Input
                    label="Вартість (грн)"
                    placeholder="Введіть вартість"
                    type="number"
                    min="0"
                    step="0.01"
                    error={errors.costs?.message}
                    {...register("costs")}
                />

                <Controller
                    name="deadline"
                    control={control}
                    render={({ field }) => (
                        <DatePicker
                            label="Дедлайн"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.deadline?.message}
                            disabled={isSubmitting}
                        />
                    )}
                />

                {serverError && (
                    <p className="create-project__server-error">
                        {serverError}
                    </p>
                )}

                <div className="create-project__actions">
                    <button
                        type="button"
                        className="create-project__btn create-project__btn--cancel"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Скасувати
                    </button>
                    <button
                        type="submit"
                        className="create-project__btn create-project__btn--submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Збереження..." : "Створити"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
