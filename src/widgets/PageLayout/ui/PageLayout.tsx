import type { FC, ReactNode } from "react";
import { Header } from "../../Header";
import "./pageLayout.scss";

interface PageLayoutProps {
    children: ReactNode;
}

export const PageLayout: FC<PageLayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <Header />
            <main className="layout__main">{children}</main>
        </div>
    );
};
