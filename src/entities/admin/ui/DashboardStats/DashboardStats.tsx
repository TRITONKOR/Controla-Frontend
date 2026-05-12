import type { FC } from "react";
import "./dashboardStats.scss";

export interface DashboardStatsProps {
    usersCount?: number;
    activeProjectsCount?: number;
    completedProjectsCount?: number;
}

export const DashboardStats: FC<DashboardStatsProps> = ({
    usersCount,
    activeProjectsCount,
    completedProjectsCount,
}) => {
    return (
        <div className="dashboard-stats">
            <h2>Статистика</h2>
            <div className="dashboard-stats__content">
                <div className="dashboard-stats__item">
                    <h3>Кількість користувачів</h3>
                    <p>{usersCount}</p>
                </div>
                <div className="dashboard-stats__item">
                    <h3>Активні проекти</h3>
                    <p>{activeProjectsCount}</p>
                </div>
                <div className="dashboard-stats__item">
                    <h3>Завершені проекти</h3>
                    <p>{completedProjectsCount}</p>
                </div>
            </div>
        </div>
    );
};
