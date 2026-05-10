import type { DragEventHandler, FC } from "react";
import type { TaskResponse } from "../../model/types";
import "./taskCard.scss";

export interface TaskCardProps {
    task: TaskResponse;
    onClick?: () => void;
    draggable?: boolean;
    onDragStart?: DragEventHandler<HTMLDivElement>;
    onDragEnd?: DragEventHandler<HTMLDivElement>;
    onTaskSelect?: (task: TaskResponse) => void;
}

const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.trim()?.[0] ?? "";
    const last = lastName?.trim()?.[0] ?? "";
    return `${first}${last}`.toUpperCase() || "?";
};

export const TaskCard: FC<TaskCardProps> = ({
    task,
    draggable,
    onDragStart,
    onDragEnd,
    onTaskSelect,
}) => {
    return (
        <div
            className="task-card"
            onClick={() => onTaskSelect?.(task)}
            role="button"
            tabIndex={0}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        >
            <h3 className="task-card__title">{task.title}</h3>

            {task.description && (
                <p className="task-card__description">{task.description}</p>
            )}

            <div className="task-card__footer">
                <div className="task-card__assignees">
                    {task.assignees?.slice(0, 3).map((assignee) => (
                        <div
                            key={assignee.id}
                            className="task-card__assignee"
                            title={`${assignee.firstName} ${assignee.lastName}`}
                        >
                            {assignee.avatarUrl ? (
                                <img
                                    className="task-card__avatar"
                                    src={assignee.avatarUrl}
                                    alt={`${assignee.firstName} ${assignee.lastName}`}
                                />
                            ) : (
                                <div className="task-card__avatar task-card__avatar--fallback">
                                    {getInitials(
                                        assignee.firstName,
                                        assignee.lastName,
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {(task.assignees?.length ?? 0) > 3 && (
                        <div
                            className="task-card__assignee task-card__assignee--count"
                            title={`Ще ${(task.assignees?.length ?? 0) - 3} осіб`}
                        >
                            +{(task.assignees?.length ?? 0) - 3}
                        </div>
                    )}
                </div>

                {task.attachmentUrl?.length > 0 && (
                    <div className="task-card__attachments-badge">
                        📎 {task.attachmentUrl.length}
                    </div>
                )}
            </div>
        </div>
    );
};
