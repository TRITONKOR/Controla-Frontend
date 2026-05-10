import type { DragEvent, FC } from "react";
import { TaskCard, type TaskResponse, type TaskStatus } from "../..";

import "./tasksList.scss";

export interface TasksListProps {
    tasks: TaskResponse[];
    title?: "Зробити" | "В процесі" | "На перевірці" | "Завершено";
    status: TaskStatus;
    isDragOver?: boolean;
    onTaskDragStart: (taskId: string) => void;
    onTaskDragEnd: () => void;
    onTaskDrop: (taskId: string, nextStatus: TaskStatus) => void;
    onColumnDragOver: (status: TaskStatus) => void;
    onColumnDragLeave: () => void;
    onCreateTask: (status: TaskStatus) => void;
    onTaskSelect: (task: TaskResponse) => void;
}

export const TasksList: FC<TasksListProps> = ({
    tasks,
    title,
    status,
    isDragOver,
    onTaskDragStart,
    onTaskDragEnd,
    onTaskDrop,
    onColumnDragOver,
    onColumnDragLeave,
    onCreateTask,
    onTaskSelect,
}) => {
    const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        onColumnDragOver(status);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const taskId = event.dataTransfer.getData("text/task-id");

        onColumnDragLeave();

        if (taskId) {
            onTaskDrop(taskId, status);
        }
    };

    return (
        <div
            className={`tasks-list ${isDragOver ? "tasks-list--drag-over" : ""}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={onColumnDragLeave}
        >
            <div className="tasks-list__header">
                <div>
                    <h2 className="tasks-list__title">{title}</h2>
                    <span className="tasks-list__count">{tasks.length}</span>
                </div>

                <button
                    className="tasks-list__create-btn"
                    onClick={() => onCreateTask(status)}
                >
                    +
                </button>
            </div>
            <div className="tasks-list__items">
                {tasks.length === 0 ? (
                    <p className="tasks-list__empty">Немає завдань</p>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            draggable
                            onDragStart={(event) => {
                                event.dataTransfer.setData(
                                    "text/task-id",
                                    task.id,
                                );
                                onTaskDragStart(task.id);
                            }}
                            onDragEnd={onTaskDragEnd}
                            onTaskSelect={() => onTaskSelect(task)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
