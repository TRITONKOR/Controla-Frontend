import type { FC } from "react";

import type { ProjectResponse } from "../../model/types";
import "./projectsList.scss";

interface ProjectsListProps {
    projects: ProjectResponse[];
    onProjectSelect: (project: ProjectResponse) => void;
    onAssignEmployees?: (project: ProjectResponse) => void;
    emptyText?: string;
}

function formatDeadline(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

export const ProjectsList: FC<ProjectsListProps> = ({
    projects,
    onProjectSelect,
    onAssignEmployees,
    emptyText,
}) => {
    if (projects.length === 0 && emptyText) {
        return (
            <div className="projects-list">
                <p className="projects-list__empty">{emptyText}</p>
            </div>
        );
    }

    return (
        <div className="projects-list">
            {projects.map((project) => {
                const totalTasks = project.tasks.length;
                const doneTasks = project.tasks.filter(
                    (t) => t.status === "DONE",
                ).length;
                const leaderName =
                    project.ownerFirstName && project.ownerLastName
                        ? `${project.ownerFirstName} ${project.ownerLastName}`
                        : "—";
                const leaderInitial = project.ownerFirstName
                    ? project.ownerFirstName[0]
                    : "?";
                const donePercent =
                    totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0;

                return (
                    <div
                        key={project.id}
                        className="project-card"
                        onClick={() => onProjectSelect(project)}
                    >
                        <div className="project-card__header">
                            <div className="project-card__icon">
                                {project.title[0].toUpperCase()}
                            </div>
                            <div className="project-card__header-info">
                                <h3 className="project-card__title">
                                    {project.title}
                                </h3>
                                <p className="project-card__tasks">
                                    {totalTasks} Завдань&nbsp;&bull;&nbsp;
                                    {doneTasks} Виконано
                                </p>
                            </div>
                            {onAssignEmployees && (
                                <button
                                    className="project-card__assign-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAssignEmployees(project);
                                    }}
                                    title="Керувати учасниками"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        width={16}
                                        height={16}
                                    >
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    {project.assignees.length > 0 && (
                                        <span className="project-card__assign-count">
                                            {project.assignees.length}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>

                        <div className="project-card__meta">
                            <div className="project-card__meta-item">
                                <span className="project-card__meta-label">
                                    Дедлайн
                                </span>
                                <span className="project-card__meta-value">
                                    {formatDeadline(project.deadline)}
                                </span>
                            </div>
                            <div className="project-card__meta-item">
                                <span className="project-card__meta-label">
                                    Вартість
                                </span>
                                <span className="project-card__meta-value">
                                    ${project.costs.toLocaleString()}
                                </span>
                            </div>
                            <div className="project-card__meta-item">
                                <span className="project-card__meta-label">
                                    Лідер
                                </span>
                                <div className="project-card__leader">
                                    <div className="project-card__leader-avatar">
                                        {project.ownerAvatar ? (
                                            <img
                                                src={project.ownerAvatar}
                                                alt={leaderName}
                                                className="project-card__leader-avatar-image"
                                            />
                                        ) : (
                                            leaderInitial
                                        )}
                                    </div>
                                    <span className="project-card__leader-name">
                                        {leaderName}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="project-card__progress">
                            <div className="project-card__progress-header">
                                <span className="project-card__progress-title">
                                    Виконання завдань
                                </span>
                                <div className="project-card__progress-counts">
                                    <span className="project-card__progress-done">
                                        {doneTasks} вик.
                                    </span>
                                    <span className="project-card__progress-remaining">
                                        {totalTasks - doneTasks} залиш.
                                    </span>
                                </div>
                            </div>
                            <div className="project-card__progress-bar">
                                <div
                                    className="project-card__progress-fill"
                                    style={{ width: `${donePercent}%` }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
