export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: "ADMIN" | "MANAGER" | "EMPLOYEE" | "PENDING";
    departmentId?: string;
    isActive: boolean;
}

export type AuthUser = Pick<User, "id" | "email" | "firstName" | "lastName">;

export interface UserStatusResponse {
    userId: string;
    role: "ADMIN" | "MANAGER" | "EMPLOYEE" | "PENDING";
    isApproved: boolean;
    isActive: boolean;
}

export interface UserDetailedResponse extends User {
    firstName: string;
    lastName: string;
}

export interface UserUpdateRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    role?: "ADMIN" | "MANAGER" | "EMPLOYEE" | "PENDING";
    departmentId?: string;
}
