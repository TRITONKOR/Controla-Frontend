import { ROUTES } from "@/app/router/routes";
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

const NAV_ITEMS: NavItem[] = [
    { label: "Дошка", icon: dashboardIcon, to: ROUTES.DASHBOARD },
    { label: "Працівники", icon: usersIcon, to: ROUTES.EMPLOYEES },
    { label: "Проєкти", icon: timelineIcon, to: ROUTES.PROJECTS },
    { label: "Налаштування", icon: settingsIcon, to: ROUTES.REPORTS },
];

export const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <h2 className="sidebar__title">Project Name</h2>
            </div>
            <nav className="sidebar__nav">
                <span className="sidebar__group-label">Проєкт</span>
                {NAV_ITEMS.map(({ label, icon, to }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `sidebar__link${isActive ? " sidebar__link--active" : ""}`
                        }
                    >
                        <img src={icon} alt="" className="sidebar__icon" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};
