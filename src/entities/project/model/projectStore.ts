import { create } from "zustand";
import type { ProjectResponse } from "./types";

interface ProjectState {
    selectedProject: ProjectResponse | null;
    setSelectedProject: (project: ProjectResponse | null) => void;
}

export const useProjectStore = create<ProjectState>()((set) => ({
    selectedProject: null,
    setSelectedProject: (project) => set({ selectedProject: project }),
}));
