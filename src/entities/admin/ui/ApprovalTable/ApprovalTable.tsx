import type { User } from "@/entities/user";
import type { FC } from "react";
import "./approvalTable.scss";

export interface ApprovalTableProps {
    users: User[];
    onApproveUser?: (userId: string) => void;
    onRejectUser?: (userId: string) => void;
    onRoleChange?: (userId: string, role: User["role"]) => void;
}

const ROLE_OPTIONS: Array<{ value: User["role"]; label: string }> = [
    { value: "EMPLOYEE", label: "Працівник" },
    { value: "MANAGER", label: "Менеджер" },
];

export const ApprovalTable: FC<ApprovalTableProps> = ({
    users,
    onApproveUser,
    onRejectUser,
    onRoleChange,
}) => {
    return (
        <div className="approval-table">
            <div className="approval-table__header">
                <h2>Заявки на затвердження</h2>
            </div>
            <table className="approval-table__table">
                <thead>
                    <tr>
                        <th>Ім'я</th>
                        <th>Прізвище</th>
                        <th>Email</th>
                        <th>Дата реєстрації</th>
                        <th>Роль</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                {user.createdAt
                                    ? new Date(user.createdAt).toLocaleString(
                                          "uk-UA",
                                          {
                                              day: "2-digit",
                                              month: "2-digit",
                                              year: "numeric",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          },
                                      )
                                    : "—"}
                            </td>
                            <td>
                                <select
                                    className="users-table__role-select"
                                    value={
                                        user.role === "PENDING"
                                            ? "EMPLOYEE"
                                            : user.role
                                    }
                                    onChange={(event) =>
                                        onRoleChange?.(
                                            user.id,
                                            event.target.value as User["role"],
                                        )
                                    }
                                >
                                    {ROLE_OPTIONS.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <div className="approval-table__actions">
                                    <button
                                        className="approval-table__approve-btn"
                                        onClick={() => onApproveUser?.(user.id)}
                                    >
                                        Затвердити
                                    </button>
                                    <button
                                        className="approval-table__reject-btn"
                                        onClick={() => onRejectUser?.(user.id)}
                                    >
                                        Відхилити
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
