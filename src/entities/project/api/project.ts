import type {
    CreateProjectRequest,
    ProjectResponse,
    ReportResponse,
} from "@/entities/project/model/types";
import { api } from "../../../api/axios";

export const projectApi = {
    getAll: async (): Promise<ProjectResponse[]> => {
        const response = await api.get<ProjectResponse[]>("/projects");
        return response.data;
    },

    getProjectsByEmployee: async (
        userId: string,
    ): Promise<ProjectResponse[]> => {
        const response = await api.get<ProjectResponse[]>("/projects", {
            params: { userId },
        });
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

    delete: async (projectId: string) => {
        const response = await api.delete(`/projects/${projectId}`);
        return response.data;
    },

    createReport: async (projectId: string): Promise<ReportResponse> => {
        const response = await api.post<ReportResponse>(
            `/projects/${projectId}/report`,
        );
        return response.data;
    },

    assignEmployee: async (projectId: string, employeeId: string) => {
        const response = await api.post(
            `/projects/${projectId}/assignees/${employeeId}`,
            {},
        );
        return response.data;
    },

    unassignEmployee: async (projectId: string, employeeId: string) => {
        const response = await api.delete(
            `/projects/${projectId}/assignees/${employeeId}`,
        );
        return response.data;
    },
};
