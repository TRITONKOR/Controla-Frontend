import type { FC } from "react";
import type { EmployeeResponse } from "../..";

import "./employeesList.scss";

interface EmployeesListProps {
    employees: EmployeeResponse[];
    onEmployeeSelect: (employee: EmployeeResponse) => void;
}

function getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.trim()?.[0] ?? "";
    const last = lastName?.trim()?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "?";
}

export const EmployeesList: FC<EmployeesListProps> = ({
    employees,
    onEmployeeSelect,
}) => {
    return (
        <div className="employees-list">
            {employees.map((employee) => {
                const fullName =
                    `${employee.firstName} ${employee.lastName}`.trim();
                const inProgressTasks = Math.max(
                    employee.tasksCount - employee.doneTasksCount,
                    0,
                );
                const productivity =
                    employee.tasksCount > 0
                        ? Math.round(
                              (employee.doneTasksCount / employee.tasksCount) *
                                  100,
                          )
                        : 0;

                return (
                    <button
                        key={employee.id}
                        type="button"
                        className="employee-card"
                        onClick={() => onEmployeeSelect(employee)}
                    >
                        <span
                            className="employee-card__menu"
                            aria-hidden="true"
                        >
                            ...
                        </span>

                        <div className="employee-card__avatar-wrap">
                            {employee.avatar ? (
                                <img
                                    className="employee-card__avatar"
                                    src={`data:image/png;base64,${employee.avatar}`}
                                    alt={fullName || "Employee avatar"}
                                />
                            ) : (
                                <div className="employee-card__avatar employee-card__avatar--fallback">
                                    {getInitials(
                                        employee.firstName,
                                        employee.lastName,
                                    )}
                                </div>
                            )}
                            <span className="employee-card__status" />
                        </div>

                        <h3 className="employee-card__name">
                            {fullName || "Невідомий працівник"}
                        </h3>
                        <p className="employee-card__role">
                            {employee.position || "Співробітник"}
                        </p>

                        <div
                            className="employee-card__stats"
                            aria-label="Employee stats"
                        >
                            <div className="employee-card__stat">
                                <span className="employee-card__stat-label">
                                    Проєктів
                                </span>
                                <span className="employee-card__stat-value">
                                    {employee.projectsCount}
                                </span>
                            </div>
                            <div className="employee-card__stat">
                                <span className="employee-card__stat-label">
                                    Готово
                                </span>
                                <span className="employee-card__stat-value">
                                    {employee.doneTasksCount}
                                </span>
                            </div>
                            <div className="employee-card__stat">
                                <span className="employee-card__stat-label">
                                    В процесі
                                </span>
                                <span className="employee-card__stat-value">
                                    {inProgressTasks}
                                </span>
                            </div>
                        </div>

                        <p className="employee-card__productivity">
                            Продуктивність : <span>{productivity}%</span>
                        </p>

                        <div
                            className="employee-card__progress"
                            aria-hidden="true"
                        >
                            <div
                                className="employee-card__progress-fill"
                                style={{ width: `${productivity}%` }}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
