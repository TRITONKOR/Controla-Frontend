import { api } from "@/api";
import type { User, UserStatusResponse } from "@/entities/user/model/types";

export interface UpdateUserPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
}

export const userApi = {
    getMe: () => api.get<User>("/users/me"),

    getAll: () => api.get<User[]>("/users"),

    getById: (id: number) => api.get<User>(`/users/${id}`),

    update: (id: number, payload: UpdateUserPayload) =>
        api.patch<User>(`/users/${id}`, payload),

    delete: (id: number) => api.delete(`/users/${id}`),

    isApproved: (userId: string) =>
        api.get<UserStatusResponse>(`/users/${userId}/status`),
};
