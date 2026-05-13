export interface TaskShortResponse {
    id: string;
    title: string;
    description: string;
    status: "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";
}

export interface EmployeeShortResponse {
    id: string;
    userId: string;
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

export type ReportTaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface StatusDistributionItem {
    status: ReportTaskStatus;
    count: number;
    percent: number;
}

export interface ReportResponse {
    projectId: string;
    projectTitle: string;

    totalTasks: number;
    doneTasks: number;
    inProgressTasks: number;
    reviewTasks: number;
    toDoTasks: number;

    donePercent: number;

    deadline: string;
    daysToDeadline: number;
    overdue: boolean;

    activeTasks: number;
    reviewShare: number;

    riskLevel: RiskLevel;

    statusDistribution: StatusDistributionItem[];
}
