export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface TaskResponse {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    attachmentUrl: string;
    attachmentName: string;
    project: ShortProjectResponse;
    assignees: AssigneeShort[];
}

export interface ShortProjectResponse {
    id: string;
    title: string;
}

export interface AssigneeShort {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
}

export interface CreateTaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
    projectId: string;
    attachmentUrl?: string;
    attachmentName?: string;
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: TaskStatus;
    attachmentUrl?: string;
    attachmentName?: string;
}
