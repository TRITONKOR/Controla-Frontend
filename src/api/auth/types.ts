import type { User } from "@/entities/user/model/types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export interface LogoutResponse {
    message: string;
}

export interface RefreshResponse {
    accessToken: string;
}
