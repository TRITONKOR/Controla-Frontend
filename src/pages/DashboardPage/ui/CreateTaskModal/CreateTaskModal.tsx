import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuthStore } from "@/app/store/authStore";
import { Input } from "@/shared/ui/AuthInput";
import { Modal } from "@/shared/ui/Modal";

import { supabase } from "@/api/supabase";
import { useProjectStore } from "@/entities/project";
import { taskApi } from "@/entities/task/api/task";
import type { TaskStatus } from "@/entities/task/model/types";
import "./createTaskModal.scss";

const createTaskSchema = z.object({
    title: z
        .string()
        .min(3, "Назва повинна містити щонайменше 3 символи")
        .max(100, "Назва не може перевищувати 100 символів"),
    description: z
        .string()
        .min(10, "Опис повинен містити щонайменше 10 символів")
        .max(1000, "Опис не може перевищувати 1000 символів"),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    status: TaskStatus;
}

export const CreateTaskModal = ({
    isOpen,
    onClose,
    onSuccess,
    status,
}: CreateTaskModalProps) => {
    const user = useAuthStore((s) => s.user);
    const [serverError, setServerError] = useState<string | null>(null);
    const currentProject = useProjectStore((s) => s.selectedProject);
    const [attachment, setAttachment] = useState<File | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
    });

    const handleClose = () => {
        reset();
        setServerError(null);
        onClose();
    };

    const onSubmit = async (data: CreateTaskFormData) => {
        if (!user || !currentProject) return;
        setServerError(null);

        try {
            const task = await taskApi.create({
                title: data.title,
                description: data.description,
                status,
                projectId: currentProject.id,
            });

            if (attachment) {
                const attachmentUrl = await uploadAttachment(attachment);
                await taskApi.update(task.id, {
                    attachmentUrl,
                    attachmentName: file?.name,
                });
            }

            reset();
            onSuccess?.();
            onClose();
        } catch (err: unknown) {
            const message =
                (err as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message ??
                "Помилка при створенні завдання";
            setServerError(message);
        }
    };

    const uploadAttachment = async (file: File) => {
        if (!user) return;

        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `tasks_attachment/${user.id}/${fileName}`;

        const { error } = await supabase.storage
            .from("tasks_attachment")
            .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase.storage
            .from("tasks_attachment")
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Створити завдання">
            <form
                className="create-task__form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <Input
                    label="Назва завдання"
                    placeholder="Введіть назву завдання"
                    error={errors.title?.message}
                    {...register("title")}
                />

                <div className="create-task__field">
                    <label className="create-task__label">Опис</label>
                    <textarea
                        className={`create-task__textarea${
                            errors.description
                                ? " create-task__textarea--error"
                                : ""
                        }`}
                        placeholder="Введіть опис завдання"
                        rows={4}
                        {...register("description")}
                    />
                    {errors.description && (
                        <span className="create-task__error">
                            {errors.description.message}
                        </span>
                    )}
                </div>

                <div className="create-task__field">
                    <label className="create-task__label">Вкладення</label>

                    <input
                        className="create-task__file-input"
                        type="file"
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                        onChange={(event) => {
                            const file = event.target.files?.[0];

                            if (file) {
                                setFile(file);
                                setAttachment(file);
                            }
                        }}
                    />

                    {attachment && (
                        <span className="create-task__file-name">
                            {attachment.name}
                        </span>
                    )}
                </div>

                {serverError && (
                    <p className="create-task__server-error">{serverError}</p>
                )}

                <div className="create-task__actions">
                    <button
                        type="button"
                        className="create-task__btn create-task__btn--cancel"
                        onClick={handleClose}
                        disabled={isSubmitting}
                    >
                        Скасувати
                    </button>
                    <button
                        type="submit"
                        className="create-task__btn create-task__btn--submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Збереження..." : "Створити"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};
