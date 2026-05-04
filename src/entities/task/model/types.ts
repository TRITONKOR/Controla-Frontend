export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    attachments: string[];
    assignees: AssigneeShort[];
}

export interface AssigneeShort {
    id: string;
    firstName: string;
    lastName: string;
    position: string;
    avatarUrl: string | null;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    projectId: string;
    attachments?: string;
}
