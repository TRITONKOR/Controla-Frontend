import type { FC } from "react";

import "./userAvatar.scss";

import defaultAvatarUrl from "@/assets/default-user-avatar.png";
import type { User } from "@/entities/user/model/types";

interface UserAvatarProps {
    user?: User;
    onClick?: () => void;
}

export const UserAvatar: FC<UserAvatarProps> = ({ user, onClick }) => {
    return (
        <div className="user-avatar" onClick={onClick}>
            <img
                src={
                    user?.avatar
                        ? `data:image/png;base64,${user.avatar}`
                        : defaultAvatarUrl
                }
                alt="User Avatar"
                className="user-avatar__image"
            />
        </div>
    );
};
