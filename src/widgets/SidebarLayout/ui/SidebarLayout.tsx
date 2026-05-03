import { Sidebar } from "@/widgets/Sidebar";
import type { FC, ReactNode } from "react";
import "./sidebarLayout.scss";

interface SidebarLayoutProps {
    children: ReactNode;
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({ children }) => {
    return (
        <div className="sidebar-layout">
            <Sidebar />
            <main className="sidebar-layout__main">{children}</main>
        </div>
    );
};
