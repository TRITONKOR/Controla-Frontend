import { api } from "@/api/axios";
import type { EmployeeResponse } from "../model/type";

export const employeeApi = {
    getAll: async (): Promise<EmployeeResponse[]> => {
        const response = await api.get<EmployeeResponse[]>("/employees");
        return response.data;
    },
};
