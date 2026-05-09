import type {
    CreateProjectRequest,
    ProjectResponse,
} from "@/entities/project/model/types";
import { api } from "../../../api/axios";

export const projectApi = {
    getAll: async (): Promise<ProjectResponse[]> => {
        const response = await api.get<ProjectResponse[]>("/projects");
        return response.data;
    },

    createProject: async (
        data: CreateProjectRequest,
    ): Promise<ProjectResponse> => {
        const response = await api.post<ProjectResponse>("/projects", data);
        return response.data;
    },

    getByUserId: async (userId: string): Promise<ProjectResponse[]> => {
        const response = await api.get<ProjectResponse[]>(
            `/users/${userId}/projects`,
        );
        return response.data;
    },
};
