import { useState, type FC } from "react";

import "./userAvatar.scss";

import defaultAvatarUrl from "@/assets/default-user-avatar.png";
import type { User } from "@/entities/user/model/types";

interface UserAvatarProps {
    user?: User;
    onClick?: () => void;
}

export const UserAvatar: FC<UserAvatarProps> = ({ user, onClick }) => {
    const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
    const avatarUrl = user?.avatar;
    const avatarSrc =
        avatarUrl && avatarUrl !== failedAvatarUrl
            ? avatarUrl
            : defaultAvatarUrl;

    const handleImageError = () => {
        if (avatarUrl) {
            setFailedAvatarUrl(avatarUrl);
        }
    };

    return (
        <div className="user-avatar" onClick={onClick}>
            <img
                src={avatarSrc}
                alt="User Avatar"
                className="user-avatar__image"
                onError={handleImageError}
            />
        </div>
    );
};
