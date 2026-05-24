import { api } from "@/api/axios";
import type {
    CreateTaskRequest,
    TaskResponse,
    UpdateTaskRequest,
} from "../model/types";

export const taskApi = {
    getByProject: async (projectId: string): Promise<TaskResponse[]> => {
        const response = await api.get<TaskResponse[]>(
            `/tasks/project/${projectId}`,
        );
        return response.data;
    },

    getByUser: async (userId: string): Promise<TaskResponse[]> => {
        const response = await api.get<TaskResponse[]>(`/tasks/user/${userId}`);
        return response.data;
    },

    create: async (createData: CreateTaskRequest) => {
        const response = await api.post("/tasks", createData);

        return response.data;
    },

    update: async (taskId: string, updateData: UpdateTaskRequest) => {
        const response = await api.patch(`/tasks/${taskId}`, updateData);
        return response.data;
    },

    assign: async (taskId: string, userId: string) => {
        const response = await api.post(
            `/tasks/${taskId}/assignees/${userId}`,
            {},
        );
        return response.data;
    },
    unassign: async (taskId: string, userId: string) => {
        const response = await api.delete(
            `/tasks/${taskId}/assignees/${userId}`,
        );
        return response.data;
    },
};
