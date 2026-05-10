import { useProjectStore } from "@/entities/project/model/projectStore";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { taskApi } from "../../api/task";
import { useTaskStore } from "../../model/taskStore";
import { TaskDetails } from "../TaskDetails/TaskDetails";
import "./taskPage.scss";

export const TaskPage: FC = () => {
    const selectedTask = useTaskStore((state) => state.selectedTask);
    const selectedProject = useProjectStore((state) => state.selectedProject);
    const navigate = useNavigate();

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
            <button className="task-page__back-btn" onClick={handleBack}>
                Назад до списку завдань
            </button>
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
