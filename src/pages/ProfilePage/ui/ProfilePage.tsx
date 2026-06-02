import { useEffect, useState, type FC, type KeyboardEvent } from "react";

import { authApi } from "@/api/auth";
import { supabase } from "@/api/supabase";
import { useAuthStore } from "@/app/store/authStore";
import {
    projectApi,
    useProjectStore,
    type ProjectResponse,
} from "@/entities/project";
import { ProjectsList } from "@/entities/project/ui/ProjectsList/ProjectsList";
import { ProfileTasksList, taskApi, type TaskResponse } from "@/entities/task";
import { userApi } from "@/entities/user";
import type { UserDetailedResponse } from "@/entities/user/model/types";
import { AvatarUpload } from "@/shared/ui/AvatarUpload";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import "./profilePage.scss";

type EditableFields = "firstName" | "lastName" | "email";

const profileFieldSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, "Ім'я повинно містити мінімум 2 символи")
        .max(50, "Ім'я занадто довге")
        .optional(),

    lastName: z
        .string()
        .trim()
        .min(2, "Прізвище повинно містити мінімум 2 символи")
        .max(50, "Прізвище занадто довге")
        .optional(),

    email: z.string().trim().email("Некоректний email").optional(),
});

export const ProfilePage: FC = () => {
    const userId = useAuthStore((state) => state.user?.id);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const setSelectedProject = useProjectStore(
        (state) => state.setSelectedProject,
    );
    const navigate = useNavigate();

    const [user, setUser] = useState<UserDetailedResponse | null>(null);
    const [userProjects, setUserProjects] = useState<ProjectResponse[]>([]);
    const [userTasks, setUserTasks] = useState<TaskResponse[]>([]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<
        Partial<Record<EditableFields, string>>
    >({});
    const [editingField, setEditingField] = useState<EditableFields | null>(
        null,
    );
    const [editValues, setEditValues] = useState<
        Partial<Record<EditableFields, string>>
    >({});
    const [openedSections, setOpenedSections] = useState({
        projects: true,
        tasks: false,
    });

    const toggleSection = (section: "projects" | "tasks") => {
        setOpenedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (userId) {
                const userResponse = await userApi.getById(userId);
                setUser(userResponse);

                const userProjects = await projectApi.getByUserId(userId);
                setUserProjects(userProjects);

                const userTasks = await taskApi.getByUser(userId);
                setUserTasks(userTasks);
            }
        };

        void fetchUser();
    }, [userId]);

    const handleProjectSelect = (project: ProjectResponse) => {
        setSelectedProject(project);
        navigate("/projects/" + project.id + "/dashboard");
    };

    const saveField = async (field: EditableFields) => {
        const newValue = editValues[field];

        if (!userId || !user || newValue === undefined) return;

        const validation = profileFieldSchema.safeParse({
            [field]: newValue,
        });

        if (!validation.success) {
            const fieldError =
                validation.error.flatten().fieldErrors[field]?.[0];

            setErrors((prev) => ({
                ...prev,
                [field]: fieldError || "Некоректне значення",
            }));

            return;
        }

        setErrors((prev) => ({
            ...prev,
            [field]: "",
        }));

        const updateData: Partial<Record<EditableFields, string>> = {
            [field]: newValue.trim(),
        };

        try {
            await userApi.update(userId, updateData);

            setUser({
                ...user,
                [field]: newValue.trim(),
            });

            setEditingField(null);
        } catch (error) {
            console.error(`Помилка при оновленні ${field}:`, error);
        }
    };

    const uploadAvatar = async (file: File) => {
        if (!userId) return;

        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `avatars/${userId}/${fileName}`;

        const { error } = await supabase.storage
            .from("avatars")
            .upload(filePath, file);

        if (error) throw error;

        const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const handleAvatarChange = async (file: File | null) => {
        if (!file || !userId || !user) return;

        try {
            const avatarUrl = await uploadAvatar(file);

            const updatedUser = await userApi.update(userId, {
                avatar: avatarUrl,
            });

            setUser(updatedUser);
            setAvatarFile(null);
        } catch (e) {
            console.error("Avatar upload error", e);
        }
    };

    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        field: EditableFields,
    ) => {
        if (e.key === "Enter") {
            void saveField(field);
        } else if (e.key === "Escape") {
            setEditingField(null);
            setEditValues({ ...editValues, [field]: user?.[field] });
        }
    };

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error("Помилка при виході:", error);
        } finally {
            clearAuth();
            navigate("/login");
        }
    };

    const renderEditableField = (label: string, field: EditableFields) => {
        const isEditing = editingField === field;

        return (
            <p
                className="profile-page__field"
                onClick={() => {
                    if (!isEditing) {
                        setEditingField(field);

                        setEditValues((prev) => ({
                            ...prev,
                            [field]: user?.[field] ?? "",
                        }));
                    }
                }}
            >
                <strong>{label}:</strong>{" "}
                {isEditing ? (
                    <div className="profile-page__input-wrapper">
                        <input
                            autoFocus
                            className="profile-page__input"
                            value={editValues[field] || ""}
                            onChange={(e) =>
                                setEditValues({
                                    ...editValues,
                                    [field]: e.target.value,
                                })
                            }
                            onKeyDown={(e) => handleKeyDown(e, field)}
                        />
                        {errors[field] && (
                            <span className="profile-page__error">
                                {errors[field]}
                            </span>
                        )}
                    </div>
                ) : (
                    <span className="profile-page__value-text">
                        {user?.[field]}
                    </span>
                )}
            </p>
        );
    };

    return (
        <div className="profile-page">
            <div className="profile-page__header">
                <h1>Профіль</h1>
                <button
                    className="profile-page__logout-btn"
                    onClick={handleLogout}
                >
                    Вихід
                </button>
            </div>
            <div className="profile-page__content">
                {user ? (
                    <>
                        <div className="profile-page__info">
                            <AvatarUpload
                                label="Аватар"
                                file={avatarFile}
                                previewUrl={
                                    avatarFile
                                        ? null
                                        : user.avatar
                                          ? user.avatar
                                          : null
                                }
                                onChange={handleAvatarChange}
                            />

                            <div className="profile-page__details">
                                {renderEditableField("Ім'я", "firstName")}
                                {renderEditableField("Прізвище", "lastName")}
                                {renderEditableField("Email", "email")}
                                <small className="profile-page__hint">
                                    Натисніть на поле, щоб змінити
                                </small>
                            </div>
                        </div>
                        <div className="profile-page__workspace">
                            <div className="profile-page__workspace-projects">
                                <h2
                                    className="profile-page__section-title"
                                    onClick={() => toggleSection("projects")}
                                >
                                    Проєкти
                                </h2>

                                {openedSections.projects && (
                                    <div className="profile-page__section-content">
                                        <ProjectsList
                                            projects={userProjects}
                                            emptyText="Користувач ще не приєднався до жодного проєкту"
                                            onProjectSelect={
                                                handleProjectSelect
                                            }
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="profile-page__workspace-tasks">
                                <h2
                                    className="profile-page__section-title"
                                    onClick={() => toggleSection("tasks")}
                                >
                                    Завдання
                                </h2>

                                {openedSections.tasks && (
                                    <div className="profile-page__section-content">
                                        <ProfileTasksList tasks={userTasks} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <p className="profile-page__loading">Завантаження...</p>
                )}
            </div>
        </div>
    );
};
