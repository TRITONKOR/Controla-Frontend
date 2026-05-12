export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    attachmentUrl: string;
    assignees: AssigneeShort[];
}

export interface AssigneeShort {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
    projectId: string;
    attachmentUrl?: string;
}
