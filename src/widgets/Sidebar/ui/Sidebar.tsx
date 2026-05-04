import { ROUTES } from "@/app/router/routes";
import type { ProjectResponse } from "@/entities/project";
import { useProjectStore } from "@/entities/project";
import { NavLink } from "react-router-dom";

import dashboardIcon from "@/assets/dashboard-sidebar-icon.png";
import settingsIcon from "@/assets/settings-sidebar-icon.png";
import timelineIcon from "@/assets/timeline-sidebar-icon.png";
import usersIcon from "@/assets/users-sidebar-icon.png";

import "./sidebar.scss";

interface NavItem {
    label: string;
    icon: string;
    to: string;
}

const NAV_ITEMS_WITH_SELECTED_PROJECT: NavItem[] = [
    { label: "Дошка", icon: dashboardIcon, to: ROUTES.DASHBOARD },
    { label: "Працівники", icon: usersIcon, to: ROUTES.EMPLOYEES },
    { label: "Статистика", icon: timelineIcon, to: ROUTES.REPORTS },
    { label: "Налаштування", icon: settingsIcon, to: ROUTES.PROJECT_SETTINGS },
];

const NAV_ITEMS: NavItem[] = [
    { label: "Проєкти", icon: dashboardIcon, to: ROUTES.PROJECTS },
    { label: "Працівники", icon: usersIcon, to: ROUTES.EMPLOYEES },
];

const getNavLink = (
    to: string,
    selectedProject: ProjectResponse | null,
): string => {
    if (!selectedProject) return to;
    return to
        .replace(":projectId", selectedProject.id)
        .replace(":projectIdParam", selectedProject.id);
};

export const Sidebar = () => {
    const selectedProject = useProjectStore((s) => s.selectedProject);
    const navItems = selectedProject
        ? NAV_ITEMS_WITH_SELECTED_PROJECT
        : NAV_ITEMS;

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <h2 className="sidebar__title">
                    {selectedProject ? selectedProject.title : "Controla"}
                </h2>
            </div>
            <nav className="sidebar__nav">
                <span className="sidebar__group-label">Проєкт</span>
                {navItems.map(({ label, icon, to }) => {
                    const href = getNavLink(to, selectedProject);
                    return (
                        <NavLink
                            key={to}
                            to={href}
                            className={({ isActive }) =>
                                `sidebar__link${isActive ? " sidebar__link--active" : ""}`
                            }
                        >
                            <img src={icon} alt="" className="sidebar__icon" />
                            <span>{label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </div>
    );
};
