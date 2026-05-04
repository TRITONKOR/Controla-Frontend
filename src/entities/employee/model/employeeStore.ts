import { create } from "zustand";
import type { EmployeeResponse } from "./type";

interface EmployeeState {
    selectedEmployee: EmployeeResponse | null;
    setSelectedEmployee: (employee: EmployeeResponse | null) => void;
}

export const useEmployeeStore = create<EmployeeState>()((set) => ({
    selectedEmployee: null,
    setSelectedEmployee: (employee) => set({ selectedEmployee: employee }),
}));
