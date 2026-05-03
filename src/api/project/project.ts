import type { ProjectResponse } from "@/entities/project/model/types";
import { api } from "../axios";

export const projectApi = {
    getAll: async (): Promise<ProjectResponse[]> => {
        const response = await api.get<ProjectResponse[]>("/projects");
        return response.data;
    },

    createProject: async (
        title: string,
        description: string,
        ownerId: string,
        costs: number,
        deadline: string,
    ): Promise<ProjectResponse> => {
        const response = await api.post<ProjectResponse>("/projects", {
            title,
            description,
            ownerId,
            costs,
            deadline,
        });
        return response.data;
    },
};
