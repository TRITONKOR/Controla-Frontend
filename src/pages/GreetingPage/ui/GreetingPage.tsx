import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import "./greetingPage.scss";

export const GreetingPage: FC = () => {
    const navigate = useNavigate();

    const handleCTAClick = () => {
        navigate("/login");
    };

    return (
        <section className="greeting">
            <div className="greeting__content">
                <h1 className="greeting__title">
                    Керуйте командою без хаосу: від{" "}
                    <span className="greeting__title-accent">обліку </span>
                    до <span className="greeting__title-accent">KPI</span> в
                    одній системі
                </h1>

                <p className="greeting__subtitle">
                    Спробуйте безкоштовно та переконайтеся, наскільки простішим
                    може бути менеджмент
                </p>

                <button className="greeting__cta" onClick={handleCTAClick}>
                    Спробувати прямо зараз
                </button>
            </div>
        </section>
    );
};
