import { useAuthStore } from "@/app/store/authStore";
import { useProjectStore } from "@/entities/project/model/projectStore";
import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { taskApi } from "../../api/task";
import { useTaskStore } from "../../model/taskStore";
import { TaskDetails } from "../TaskDetails/TaskDetails";
import "./taskPage.scss";

export const TaskPage: FC = () => {
    const selectedTask = useTaskStore((state) => state.selectedTask);
    const selectedProject = useProjectStore((state) => state.selectedProject);
    const currentUser = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    const [isAssigning, setIsAssigning] = useState(false);

    const isAssigned = !!(
        currentUser &&
        selectedTask?.assignees.some((a) => a.userId === currentUser.id)
    );

    const handleAssign = async () => {
        if (!selectedTask || !currentUser) return;
        setIsAssigning(true);
        try {
            if (isAssigned) {
                await taskApi.unassign(selectedTask.id, currentUser.id);
                useTaskStore.setState({
                    selectedTask: {
                        ...selectedTask,
                        assignees: selectedTask.assignees.filter(
                            (a) => a.userId !== currentUser.id,
                        ),
                    },
                });
            } else {
                await taskApi.assign(selectedTask.id, currentUser.id);
                useTaskStore.setState({
                    selectedTask: {
                        ...selectedTask,
                        assignees: [
                            ...selectedTask.assignees,
                            {
                                id: currentUser.id,
                                userId: currentUser.id,
                                firstName: currentUser.firstName,
                                lastName: currentUser.lastName,
                                avatarUrl: currentUser.avatar ?? null,
                            },
                        ],
                    },
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsAssigning(false);
        }
    };

    const handleDownloadAttachment = async () => {
        if (!selectedTask?.attachmentUrl) {
            return;
        }

        try {
            await taskApi.downloadAttachment(selectedTask.attachmentUrl);
        } catch (error) {
            console.error(error);
        }
    };

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
                {selectedTask && (
                    <button
                        className={`task-page__assign-btn${
                            isAssigned ? " task-page__assign-btn--active" : ""
                        }`}
                        onClick={handleAssign}
                        disabled={isAssigning}
                    >
                        {isAssigned ? "Відписатись" : "Підписатись"}
                    </button>
                )}
            </div>
            {!selectedTask ? (
                <p className="task-page__no-task">
                    Виберіть завдання для перегляду
                </p>
            ) : (
                <TaskDetails
                    selectedTask={selectedTask}
                    onDownloadAttachment={handleDownloadAttachment}
                />
            )}
        </section>
    );
};
