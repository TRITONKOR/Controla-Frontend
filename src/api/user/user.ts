import { api } from "../axios";

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: "admin" | "manager" | "employee" | "pending";
    departmentId?: number;
    createdAt: string;
}

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
};
