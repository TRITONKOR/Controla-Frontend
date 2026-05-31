import { employeeApi } from "@/entities/employee";
import type { EmployeeResponse } from "@/entities/employee/model/type";
import { useProjectStore } from "@/entities/project";
import { projectApi } from "@/entities/project/api/project";
import type {
    EmployeeShortResponse,
    ProjectResponse,
} from "@/entities/project/model/types";
import { Modal } from "@/shared/ui/Modal";
import { useEffect, useState, type FC } from "react";
import "./AssignProjectEmployeesModal.scss";

interface AssignProjectEmployeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: ProjectResponse;
    onSuccess: () => void;
}

interface AssignProjectEmployeesModalContentProps {
    onClose: () => void;
    project: ProjectResponse;
    onSuccess: () => void;
}

const getInitials = (firstName: string, lastName: string) =>
    `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

const AssignProjectEmployeesModalContent: FC<
    AssignProjectEmployeesModalContentProps
> = ({ onClose, project, onSuccess }) => {
    const setSelectedProject = useProjectStore((s) => s.setSelectedProject);

    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        () => new Set(project.assignees.map((a) => a.id)),
    );
    const [search, setSearch] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        employeeApi
            .getAll()
            .then(setEmployees)
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    const toggleEmployee = (employeeId: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(employeeId)) {
                next.delete(employeeId);
            } else {
                next.add(employeeId);
            }
            return next;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const prevIds = new Set(project.assignees.map((a) => a.id));

            const toAssign = [...selectedIds].filter((id) => !prevIds.has(id));
            const toUnassign = [...prevIds].filter(
                (id) => !selectedIds.has(id),
            );

            await Promise.all([
                ...toAssign.map((id) =>
                    projectApi.assignEmployee(project.id, id),
                ),
                ...toUnassign.map((id) =>
                    projectApi.unassignEmployee(project.id, id),
                ),
            ]);

            const newAssignees: EmployeeShortResponse[] = employees
                .filter((emp) => selectedIds.has(emp.id))
                .map((emp) => ({
                    id: emp.id,
                    userId: emp.id,
                    firstName: emp.firstName,
                    lastName: emp.lastName,
                    departmentTitle: emp.departmentTitle,
                }));

            const updatedProject = { ...project, assignees: newAssignees };
            setSelectedProject(updatedProject);

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const filtered = employees.filter((emp) => {
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    });

    return (
        <div className="assign-modal">
            <input
                className="assign-modal__search"
                type="text"
                placeholder="Пошук за іменем..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="assign-modal__list">
                {isLoading ? (
                    <p className="assign-modal__empty">Завантаження...</p>
                ) : filtered.length === 0 ? (
                    <p className="assign-modal__empty">
                        Працівників не знайдено
                    </p>
                ) : (
                    filtered.map((emp) => {
                        const isSelected = selectedIds.has(emp.id);
                        return (
                            <div
                                key={emp.id}
                                className={`assign-modal__item${isSelected ? " assign-modal__item--selected" : ""}`}
                                onClick={() => toggleEmployee(emp.id)}
                            >
                                <div className="assign-modal__avatar">
                                    {emp.avatar ? (
                                        <img
                                            src={emp.avatar}
                                            alt={`${emp.firstName} ${emp.lastName}`}
                                        />
                                    ) : (
                                        getInitials(emp.firstName, emp.lastName)
                                    )}
                                </div>
                                <div className="assign-modal__info">
                                    <span className="assign-modal__name">
                                        {emp.firstName} {emp.lastName}
                                    </span>
                                </div>
                                <div
                                    className={`assign-modal__checkbox${isSelected ? " assign-modal__checkbox--checked" : ""}`}
                                >
                                    <svg
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        width="12"
                                        height="10"
                                    >
                                        <polyline
                                            points="1 5 4.5 8.5 11 1"
                                            stroke="white"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="assign-modal__footer">
                <button
                    className="assign-modal__cancel-btn"
                    onClick={onClose}
                    disabled={isSaving}
                >
                    Скасувати
                </button>
                <button
                    className="assign-modal__save-btn"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Збереження..." : "Зберегти"}
                </button>
            </div>
        </div>
    );
};

export const AssignProjectEmployeesModal: FC<
    AssignProjectEmployeesModalProps
> = ({ isOpen, onClose, project, onSuccess }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Учасники проєкту">
            {isOpen && (
                <AssignProjectEmployeesModalContent
                    onClose={onClose}
                    project={project}
                    onSuccess={onSuccess}
                />
            )}
        </Modal>
    );
};
