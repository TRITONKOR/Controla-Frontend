import { useEffect, useState, type FC } from "react";

import { useAuthStore } from "@/app/store/authStore";
import { projectApi, useProjectStore } from "@/entities/project";
import type { ProjectResponse } from "@/entities/project/model/types";
import { ProjectsList } from "@/entities/project/ui/ProjectsList/ProjectsList";
import { useNavigate } from "react-router-dom";
import { CreateProjectPage } from "../CreateProjectPage/CreateProjectPage";
import "./projectsPage.scss";

export const ProjectsPage: FC = () => {
    const user = useAuthStore((s) => s.user);
    const navigate = useNavigate();
    const setSelectedProject = useProjectStore(
        (state) => state.setSelectedProject,
    );

    const [projects, setProjects] = useState<ProjectResponse[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadProjects = () => {
        projectApi.getAll().then(setProjects).catch(console.error);
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleProjectSelect = (project: ProjectResponse) => {
        setSelectedProject(project);
        navigate("/projects/" + project.id + "/dashboard");
    };

    return (
        <div className="projects">
            <div className="projects__header">
                <h1>Проєкти</h1>
                <div className="projects__actions">
                    {user?.role === "MANAGER" && (
                        <button
                            className="projects__create-button"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Створити проєкт
                        </button>
                    )}
                </div>
            </div>
            <div className="projects__content">
                <ProjectsList
                    onProjectSelect={handleProjectSelect}
                    projects={projects}
                />
            </div>
            <CreateProjectPage
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadProjects}
            />
        </div>
    );
};
