import type { FC } from "react";

import { Sidebar } from "@/widgets/Sidebar";
import "./homePage.scss";

export const HomePage: FC = () => {
    return (
        <div className="home">
            <div className="home__sidebar">
                <Sidebar />
            </div>
            <div className="home__content">
                <h1>Головна сторінка</h1>
                <p>Ласкаво просимо до Controla!</p>
            </div>
        </div>
    );
};
