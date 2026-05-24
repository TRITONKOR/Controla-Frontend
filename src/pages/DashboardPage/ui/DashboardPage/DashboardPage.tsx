import { useProjectStore } from "@/entities/project";
import type { TaskResponse, TaskStatus } from "@/entities/task";
import { TasksList, taskApi } from "@/entities/task";
import { useTaskStore } from "@/entities/task/model/taskStore";
import { useEffect, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { CreateTaskModal } from "../CreateTaskModal/CreateTaskModal";
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
    const setSelectedTask = useTaskStore((s) => s.setSelectedTask);
    const [tasks, setTasks] = useState<TaskResponse[]>([]);
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(
        null,
    );
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

    const [createTaskStatus, setCreateTaskStatus] =
        useState<TaskStatus>("TO_DO");

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
            const updatedTask = await taskApi.update(taskId, {
                status: nextStatus,
            });

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

    const handleOpenCreateTask = (status: TaskStatus) => {
        setCreateTaskStatus(status);
        setIsCreateTaskOpen(true);
    };

    const handleTaskSelect = (task: TaskResponse) => {
        setSelectedTask(task);
        navigate("/projects/" + selectedProject?.id + "/dashboard/" + task.id);
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-page__header">
                <h1 className="dashboard-page__title">
                    Дошка завдань - {selectedProject?.title}
                </h1>
            </div>
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
                        onCreateTask={handleOpenCreateTask}
                        onTaskSelect={handleTaskSelect}
                    />
                ))}
            </div>

            <CreateTaskModal
                isOpen={isCreateTaskOpen}
                status={createTaskStatus}
                onClose={() => setIsCreateTaskOpen(false)}
                onSuccess={async () => {
                    if (!selectedProject) return;

                    const updatedTasks = await taskApi.getByProject(
                        selectedProject.id,
                    );

                    setTasks(updatedTasks);
                }}
            />
        </div>
    );
};
