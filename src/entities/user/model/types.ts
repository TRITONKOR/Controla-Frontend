export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role: "admin" | "manager" | "employee" | "pending";
    departmentId?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
}

export type AuthUser = Pick<User, "id" | "email" | "firstName" | "lastName">;
