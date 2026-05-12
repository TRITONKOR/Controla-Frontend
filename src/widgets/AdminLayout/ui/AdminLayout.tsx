import type { FC, ReactNode } from "react";
import "./adminLayout.scss";

interface AdminLayoutProps {
    children: ReactNode;
}

export const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
    return <div className="admin-layout">{children}</div>;
};
