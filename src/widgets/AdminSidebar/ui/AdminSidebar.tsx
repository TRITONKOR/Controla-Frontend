import dashboardIcon from "@/assets/dashboard-sidebar-icon.png";
import usersIcon from "@/assets/users-sidebar-icon.png";

import type { FC } from "react";
import "./adminSidebar.scss";

export type AdminTab = "dashboard" | "projects" | "employees" | "approval";

interface NavItem {
    label: string;
    icon: string;
    value: AdminTab;
}

const NAV_ITEMS: NavItem[] = [
    {
        label: "Dashboard",
        icon: dashboardIcon,
        value: "dashboard",
    },
    {
        label: "Проєкти",
        icon: dashboardIcon,
        value: "projects",
    },
    {
        label: "Працівники",
        icon: usersIcon,
        value: "employees",
    },
    {
        label: "Очікують підтвердження",
        icon: usersIcon,
        value: "approval",
    },
];

interface Props {
    activeTab: AdminTab;
    onChange: (tab: AdminTab) => void;
    pendingCount?: number;
    onLogout?: () => void;
}

export const AdminSidebar: FC<Props> = ({
    activeTab,
    onChange,
    pendingCount = 0,
    onLogout,
}: Props) => {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__header">
                <h2 className="admin-sidebar__title">Адмін-панель</h2>
            </div>

            <nav className="admin-sidebar__nav">
                {NAV_ITEMS.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => onChange(item.value)}
                        className={`
                            admin-sidebar__link
                            ${
                                activeTab === item.value
                                    ? "admin-sidebar__link--active"
                                    : ""
                            }
                        `}
                    >
                        <img
                            src={item.icon}
                            alt=""
                            className="admin-sidebar__icon"
                        />

                        <span>{item.label}</span>
                        {item.value === "approval" && pendingCount > 0 && (
                            <span className="admin-sidebar__badge">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            <button
                type="button"
                className="admin-sidebar__logout"
                onClick={onLogout}
            >
                Вийти з акаунту
            </button>
        </aside>
    );
};
