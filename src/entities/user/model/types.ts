export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    createdAt: string;
    role: "ADMIN" | "MANAGER" | "EMPLOYEE" | "PENDING";
    departmentId?: string;
    isApproved: boolean;
}

export type AuthUser = Pick<User, "id" | "email" | "firstName" | "lastName">;

export interface UserStatusResponse {
    userId: string;
    role: "ADMIN" | "MANAGER" | "EMPLOYEE" | "PENDING";
    isApproved: boolean;
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
