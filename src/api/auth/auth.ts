import { api } from "../axios";
import type { AuthResponse } from "./types";

export const authApi = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", {
            email,
            password,
        });
        return response.data;
    },

    register: async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/register", {
            email,
            password,
            firstName,
            lastName,
        });
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post("/auth/logout");
    },

    refresh: async (): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/refresh");
        return response.data;
    },
};
