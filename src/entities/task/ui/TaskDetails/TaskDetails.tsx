import type { FC } from "react";
import type { TaskResponse } from "../../model/types";
import "./taskDetails.scss";

export interface TaskDetailsProps {
    selectedTask: TaskResponse;
    onDownloadAttachment?: () => void;
}

const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
};

export const TaskDetails: FC<TaskDetailsProps> = ({
    selectedTask,
    onDownloadAttachment,
}) => {
    return (
        <>
            <header className="task-details__header">
                <h1 className="task-details__title">{selectedTask.title}</h1>
            </header>

            <p className="task-details__description">
                {selectedTask.description}
            </p>

            <div className="task-details__attachment">
                <div className="task-details__attachment-info">
                    <p className="task-details__label">Вкладений файл</p>
                    <p className="task-details__file-name">
                        {selectedTask.attachmentUrl?.split("_").pop()}
                    </p>
                </div>

                <button
                    className="task-details__download-btn"
                    onClick={onDownloadAttachment}
                >
                    Завантажити
                </button>
            </div>

            <div className="task-details__signed-users">
                <p className="task-details__label">Підписані користувачі</p>

                <div className="task-details__avatars">
                    {selectedTask.assignees.map((user) => (
                        <div
                            key={user.id}
                            className="task-details__avatar"
                            title={`${user.firstName} ${user.lastName}`}
                            aria-label={`${user.firstName} ${user.lastName}`}
                        >
                            {getInitials(user.firstName, user.lastName)}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
