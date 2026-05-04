import { useProjectStore } from "@/entities/project";
import type { TaskResponse, TaskStatus } from "@/entities/task";
import { taskApi } from "@/entities/task/api/task";
import { TasksList } from "@/entities/task/ui/TasksList/TasksList";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboardPage.scss";

const COLUMNS: Array<{
    title: "Зробити" | "В процесі" | "На перевірці" | "Завершено";
    status: TaskStatus;
}> = [
    { title: "Зробити", status: "TO_DO" },
    { title: "В процесі", status: "IN_PROGRESS" },
    { title: "На перевірці", status: "REVIEW" },
    { title: "Завершено", status: "DONE" },
];

export const DashboardPage: FC = () => {
    const navigate = useNavigate();
    const selectedProject = useProjectStore((s) => s.selectedProject);
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(
        null,
    );

    useEffect(() => {
        if (!selectedProject) {
            navigate("/projects");
            return;
        }

        taskApi
            .getByProject(selectedProject.id)
            .then(setTasks)
            .catch(console.error);
    }, [selectedProject, navigate]);

    const handleTaskDrop = async (taskId: string, nextStatus: TaskStatus) => {
        const taskToMove = tasks.find((task) => task.id === taskId);

        setDragOverStatus(null);
        setDraggedTaskId(null);

        if (!taskToMove || taskToMove.status === nextStatus) {
            return;
        }

        const previousStatus = taskToMove.status;

        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId ? { ...task, status: nextStatus } : task,
            ),
        );

        try {
            const updatedTask = await taskApi.updateStatus(taskId, nextStatus);

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task,
                ),
            );
        } catch (error) {
            console.error(error);

            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId
                        ? { ...task, status: previousStatus }
                        : task,
                ),
            );
        }
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-page__header"></div>
            <div className="dashboard-page__content">
                {COLUMNS.map((column) => (
                    <TasksList
                        key={column.status}
                        title={column.title}
                        status={column.status}
                        tasks={tasks.filter(
                            (task) => task.status === column.status,
                        )}
                        isDragOver={dragOverStatus === column.status}
                        onTaskDragStart={setDraggedTaskId}
                        onTaskDragEnd={() => {
                            setDraggedTaskId(null);
                            setDragOverStatus(null);
                        }}
                        onColumnDragOver={setDragOverStatus}
                        onColumnDragLeave={() => {
                            if (draggedTaskId) {
                                setDragOverStatus(null);
                            }
                        }}
                        onTaskDrop={handleTaskDrop}
                    />
                ))}
            </div>
        </div>
    );
};
