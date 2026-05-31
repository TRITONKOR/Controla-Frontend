import { useAuthStore } from "@/app/store/authStore";
import { useProjectStore } from "@/entities/project/model/projectStore";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskStore } from "../../model/taskStore";
import { TaskDetails } from "../TaskDetails/TaskDetails";
import { AssignEmployeesModal } from "./AssignEmployeesModal/AssignEmployeesModal";
import "./taskPage.scss";

export const TaskPage: FC = () => {
    const selectedTask = useTaskStore((state) => state.selectedTask);
    const selectedProject = useProjectStore((state) => state.selectedProject);
    const currentUser = useAuthStore((state) => state.user);
    const navigate = useNavigate();

    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const isManager = currentUser?.role === "MANAGER";

    const handleBack = () => {
        useTaskStore.setState({ selectedTask: null });
        navigate(`/projects/${selectedProject?.id}/dashboard`);
    };

    return (
        <section className="task-page">
            <div className="task-page__toolbar">
                <button className="task-page__back-btn" onClick={handleBack}>
                    Назад до списку завдань
                </button>

                {isManager && selectedTask && (
                    <button
                        className="task-page__assign-btn"
                        onClick={() => setIsAssignModalOpen(true)}
                    >
                        Призначити робітників
                    </button>
                )}
            </div>

            {!selectedTask ? (
                <p className="task-page__no-task">
                    Виберіть завдання для перегляду
                </p>
            ) : (
                <TaskDetails selectedTask={selectedTask} />
            )}

            {selectedTask && (
                <AssignEmployeesModal
                    isOpen={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    task={selectedTask}
                />
            )}
        </section>
    );
};
