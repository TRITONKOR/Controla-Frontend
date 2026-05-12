import type { User } from "@/entities/user";
import type { FC } from "react";
import "./usersTable.scss";

export interface UsersTableProps {
    users: User[];
    onRoleChange?: (userId: string, role: User["role"]) => void;
    onDeleteUser?: (userId: string) => void;
}

const ROLE_OPTIONS: Array<{ value: User["role"]; label: string }> = [
    { value: "ADMIN", label: "Адміністратор" },
    { value: "MANAGER", label: "Менеджер" },
    { value: "EMPLOYEE", label: "Працівник" },
];

export const UsersTable: FC<UsersTableProps> = ({
    users,
    onRoleChange,
    onDeleteUser,
}) => {
    return (
        <div className="users-table">
            <div className="users-table__header">
                <h2>Користувачі</h2>
            </div>
            <table className="users-table__table">
                <thead>
                    <tr>
                        <th>Ім'я</th>
                        <th>Прізвище</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    className="users-table__role-select"
                                    value={user.role}
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
                                <button
                                    type="button"
                                    className="users-table__delete-btn"
                                    onClick={() => onDeleteUser?.(user.id)}
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
