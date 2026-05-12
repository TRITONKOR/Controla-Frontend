import { useEffect, useState, type FC } from "react";

import { authApi } from "@/api";
import { useAuthStore } from "@/app/store/authStore";
import {
    ApprovalTable,
    DashboardStats,
    ProjectsTable,
    UsersTable,
} from "@/entities/admin";
import { projectApi, type ProjectResponse } from "@/entities/project";
import { userApi, type User } from "@/entities/user";
import { AdminSidebar, type AdminTab } from "@/widgets/AdminSidebar";
import { useNavigate } from "react-router-dom";
import "./adminPage.scss";

export const AdminPage: FC = () => {
    const [tab, setTab] = useState<AdminTab>("dashboard");
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await userApi.getAll();
            setUsers(response);
        };
        const fetchProjects = async () => {
            const response = await projectApi.getAll();
            setProjects(response);
        };

        fetchUsers();
        fetchProjects();
    }, []);

    const handleRoleChange = async (userId: string, role: User["role"]) => {
        try {
            const updatedUser = await userApi.updateRole(userId, role);
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === updatedUser.userId
                        ? { ...user, role: updatedUser.role }
                        : user,
                ),
            );
        } catch (error) {
            console.error("Помилка при зміні ролі користувача:", error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await userApi.delete(userId);
            setUsers((prev) => prev.filter((user) => user.id !== userId));
        } catch (error) {
            console.error("Помилка при видаленні користувача:", error);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            await projectApi.delete(projectId);
            setProjects((prev) =>
                prev.filter((project) => project.id !== projectId),
            );
        } catch (error) {
            console.error("Помилка при видаленні проекту:", error);
        }
    };

    const handleApproveUser = async (userId: string) => {
        try {
            const updatedUser = await userApi.approve(userId);
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === updatedUser.userId
                        ? { ...user, isApproved: true }
                        : user,
                ),
            );
        } catch (error) {
            console.error("Помилка при затвердженні користувача:", error);
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

    const pendingUsersCount = users.filter(
        (user) => user.isApproved === false,
    ).length;

    return (
        <div className="admin-page">
            <AdminSidebar
                activeTab={tab}
                onChange={setTab}
                pendingCount={pendingUsersCount}
                onLogout={handleLogout}
            />

            <main className="admin-page__content">
                {tab === "dashboard" && (
                    <DashboardStats
                        usersCount={users.length}
                        activeProjectsCount={
                            projects.filter((p) => p.status === "ACTIVE").length
                        }
                        completedProjectsCount={
                            projects.filter((p) => p.status === "COMPLETED")
                                .length
                        }
                    />
                )}

                {tab === "projects" && (
                    <ProjectsTable
                        projects={projects}
                        onDeleteProject={handleDeleteProject}
                    />
                )}

                {tab === "employees" && (
                    <UsersTable
                        users={users}
                        onRoleChange={handleRoleChange}
                        onDeleteUser={handleDeleteUser}
                    />
                )}

                {tab === "approval" && (
                    <ApprovalTable
                        users={users.filter(
                            (user) => user.isApproved === false,
                        )}
                        onRoleChange={handleRoleChange}
                        onApproveUser={handleApproveUser}
                        onRejectUser={handleDeleteUser}
                    />
                )}
            </main>
        </div>
    );
};
