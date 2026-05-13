import type { FC } from "react";

import type { TaskResponse } from "../../model/types";
import { TaskCard } from "../TaskCard/TaskCard";
import "./profileTasksList.scss";

interface ProfileTasksListProps {
    tasks: TaskResponse[];
    emptyText?: string;
    onTaskSelect?: (task: TaskResponse) => void;
}

export const ProfileTasksList: FC<ProfileTasksListProps> = ({
    tasks,
    emptyText = "Користувач ще не приєднався до жодного завдання",
    onTaskSelect,
}) => {
    return (
        <div className="profile-tasks-list">
            {tasks.length === 0 ? (
                <p className="profile-tasks-list__empty">{emptyText}</p>
            ) : (
                tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        onTaskSelect={() => onTaskSelect?.(task)}
                    />
                ))
            )}
        </div>
    );
};
