import { api } from "../axios";
import type { AuthResponse } from "./types";

export const authApi = {
    login: (email: string, password: string): Promise<AuthResponse> =>
        api.post("/auth/login", { email, password }),

    register: (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
    ): Promise<AuthResponse> =>
        api.post("/auth/register", { email, password, firstName, lastName }),

    logout: () => api.post("/auth/logout"),

    refresh: () => api.post("/auth/refresh"),
};
