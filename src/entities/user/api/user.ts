import { api } from "@/api";
import type { User, UserStatusResponse } from "@/entities/user/model/types";

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: User["role"];
}

export const userApi = {
    getAll: async () => {
        const response = await api.get<User[]>("/users");
        return response.data;
    },

    getById: async (userId: string) => {
        const response = await api.get<User>(`/users/${userId}`);
        return response.data;
    },

    update: async (userId: string, payload: UpdateUserPayload) => {
        const response = await api.patch<User>(`/users/${userId}`, payload);
        return response.data;
    },

    uploadAvatar: async (userId: string, file: File) => {
        const formData = new FormData();
        formData.append("avatar", file);
        const response = await api.patch<User>(
            `/users/${userId}/avatar`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );
        return response.data;
    },

    updateRole: async (userId: string, newRole: string) => {
        const response = await api.patch<UserStatusResponse>(
            `/admin/users/${userId}`,
            {
                role: newRole,
            },
        );
        return response.data;
    },

    delete: async (userId: string) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },

    isApproved: async (userId: string) => {
        const response = await api.get<UserStatusResponse>(
            `/users/${userId}/status`,
        );
        return response.data;
    },

    approve: async (userId: string) => {
        const response = await api.post<UserStatusResponse>(
            `/admin/users/${userId}/approve`,
        );
        return response.data;
    },
};
