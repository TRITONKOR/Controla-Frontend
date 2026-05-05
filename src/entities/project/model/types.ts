export interface TaskShortResponse {
    id: string;
    title: string;
    description: string;
    status: "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";
}

export interface EmployeeShortResponse {
    id: string;
    firstName: string;
    lastName: string;
    departmentTitle: string;
}

export interface ProjectResponse {
    id: string;
    title: string;
    description: string;
    ownerId: string;
    ownerFirstName: string;
    ownerLastName: string;
    ownerAvatar: string;
    status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
    costs: number;
    deadline: string;
    tasks: TaskShortResponse[];
    assignees: EmployeeShortResponse[];
}

export interface CreateProjectRequest {
    title: string;
    description: string;
    costs: number;
    deadline: string;
}
