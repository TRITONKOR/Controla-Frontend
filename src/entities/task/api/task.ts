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

    createTask: async (formData: FormData) => {
        const response = await api.post("/tasks", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    },

    downloadAttachment: async (attachmentUrl: string) => {
        const response = await api.get(attachmentUrl, {
            responseType: "blob",
        });

        const contentDisposition = response.headers["content-disposition"];
        let filename = "attachment";

        if (contentDisposition) {
            const rfc5987Match = contentDisposition.match(
                /filename\*=UTF-8''([^;\s]+)/i,
            );
            const plainMatch = contentDisposition.match(/filename="([^"]+)"/);

            if (rfc5987Match?.[1]) {
                filename = decodeURIComponent(rfc5987Match[1]);
            } else if (plainMatch?.[1]) {
                filename = plainMatch[1];
            }
        }

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};
