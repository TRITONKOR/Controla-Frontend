import type { FC, ReactNode } from "react";
import { Header } from "../../Header";
import "./headerLayout.scss";

interface HeaderLayoutProps {
    children: ReactNode;
}

export const HeaderLayout: FC<HeaderLayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="layout__main">{children}</main>
        </div>
    );
};
