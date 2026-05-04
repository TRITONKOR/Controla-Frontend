import { useEffect, useState, type FC } from "react";

import { projectApi } from "@/api";
import { useProjectStore } from "@/entities/project";
import type { ProjectResponse } from "@/entities/project/model/types";
import { ProjectsList } from "@/entities/project/ui/ProjectsList/ProjectsList";
import { useNavigate } from "react-router-dom";
import "./projectsPage.scss";

export const ProjectsPage: FC = () => {
    const navigate = useNavigate();
    const setSelectedProject = useProjectStore(
        (state) => state.setSelectedProject,
    );

    const [projects, setProjects] = useState<ProjectResponse[]>([]);

    useEffect(() => {
        projectApi.getAll().then(setProjects).catch(console.error);
    }, []);

    const handleProjectSelect = (project: ProjectResponse) => {
        setSelectedProject(project);
        navigate("/projects/" + project.id + "/dashboard");
    };

    return (
        <div className="projects">
            <div className="projects__header">
                <h1>Проєкти</h1>
            </div>
            <div className="projects__content">
                <ProjectsList
                    onProjectSelect={handleProjectSelect}
                    projects={projects}
                />
            </div>
        </div>
    );
};
