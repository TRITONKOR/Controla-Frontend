export interface TaskShortResponse {
    id: string;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "done";
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
    status: "active" | "completed" | "archived";
    costs: number;
    deadline: string;
    tasks: TaskShortResponse[];
    assignees: EmployeeShortResponse[];
}
