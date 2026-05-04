import { api } from "@/api/axios";
import type { TaskResponse, TaskStatus } from "../model/types";

export const taskApi = {
    getByProject: async (projectId: string): Promise<TaskResponse[]> => {
        const response = await api.get<TaskResponse[]>(
            `/tasks/project/${projectId}`,
        );
        return response.data;
    },

    updateStatus: async (
        taskId: string,
        status: TaskStatus,
    ): Promise<TaskResponse> => {
        const response = await api.patch<TaskResponse>(
            `/tasks/${taskId}/status`,
            {
                status,
            },
        );
        return response.data;
    },
};
