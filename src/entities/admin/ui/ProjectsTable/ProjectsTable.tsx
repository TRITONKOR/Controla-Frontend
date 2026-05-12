import type { ProjectResponse } from "@/entities/project";
import type { FC } from "react";

import "./projectsTable.scss";

export interface ProjectsTableProps {
    projects: ProjectResponse[];
    onDeleteProject?: (projectId: string) => void;
}

export const ProjectsTable: FC<ProjectsTableProps> = ({
    projects,
    onDeleteProject,
}) => {
    return (
        <div className="projects-table">
            <div className="projects-table__header">
                <h2>Проекти</h2>
            </div>
            <table className="projects-table__table">
                <thead>
                    <tr>
                        <th>Назва</th>
                        <th>Опис</th>
                        <th>Статус</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id}>
                            <td>{project.title}</td>
                            <td>{project.description}</td>
                            <td>{project.status}</td>
                            <td>
                                <button
                                    className="projects-table__delete-btn"
                                    onClick={() =>
                                        onDeleteProject?.(project.id)
                                    }
                                >
                                    Видалити
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
