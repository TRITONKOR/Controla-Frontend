import { create } from "zustand";
import type { TaskResponse } from "./types";

interface TaskState {
    selectedTask: TaskResponse | null;
    setSelectedTask: (task: TaskResponse | null) => void;
}

export const useTaskStore = create<TaskState>()((set) => ({
    selectedTask: null,
    setSelectedTask: (task) => set({ selectedTask: task }),
}));
