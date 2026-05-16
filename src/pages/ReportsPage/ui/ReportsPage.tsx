import {
    projectApi,
    useProjectStore,
    type ReportResponse,
    type ReportTaskStatus,
} from "@/entities/project";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import "./reportsPage.scss";

const STATUS_LABELS: Record<ReportTaskStatus, string> = {
    TO_DO: "Зробити",
    IN_PROGRESS: "В процесі",
    REVIEW: "На перевірці",
    DONE: "Завершено",
};

const RISK_LABELS = {
    LOW: "Низький",
    MEDIUM: "Середній",
    HIGH: "Високий",
} as const;

export const ReportsPage: FC = () => {
    const reportRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const selectedProject = useProjectStore((state) => state.selectedProject);
    const [report, setReport] = useState<ReportResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const loadReport = useCallback(async () => {
        if (!selectedProject) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        try {
            const response = await projectApi.createReport(selectedProject.id);
            setReport(response);
        } catch (error) {
            console.error("Помилка при отриманні звіту:", error);
            setErrorMessage("Не вдалося завантажити звіт. Спробуйте ще раз.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedProject]);

    useEffect(() => {
        if (!selectedProject) {
            navigate("/projects");
            return;
        }

        const timerId = window.setTimeout(() => {
            void loadReport();
        }, 0);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [navigate, selectedProject, loadReport]);

    if (!selectedProject) {
        return null;
    }

    if (isLoading) {
        return <div className="reports-page__state">Завантаження звіту...</div>;
    }

    if (errorMessage) {
        return (
            <div className="reports-page__state reports-page__state--error">
                <p>{errorMessage}</p>
                <button
                    className="reports-page__retry-btn"
                    onClick={() => void loadReport()}
                >
                    Повторити
                </button>
            </div>
        );
    }

    if (!report) {
        return null;
    }

    const riskLabel = RISK_LABELS[report.riskLevel] ?? report.riskLevel;

    const handleExportPdf = async () => {
        if (!reportRef.current) {
            return;
        }

        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
            });

            const imageData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imageWidth = canvas.width;
            const imageHeight = canvas.height;

            const ratio = Math.min(
                pdfWidth / imageWidth,
                pdfHeight / imageHeight,
            );

            const finalWidth = imageWidth * ratio;
            const finalHeight = imageHeight * ratio;

            pdf.addImage(imageData, "PNG", 0, 0, finalWidth, finalHeight);

            pdf.save(`report-${report.projectTitle}.pdf`);
        } catch (error) {
            console.error("Помилка експорту PDF:", error);
        }
    };

    return (
        <div className="reports-page" ref={reportRef}>
            <header className="reports-page__header">
                <h1 className="reports-page__title">Звіт по проєкту</h1>
                <p className="reports-page__project-name">
                    {report.projectTitle}
                </p>
            </header>

            <section className="reports-page__kpis">
                <article className="reports-kpi-card">
                    <p className="reports-kpi-card__label">Всього задач</p>
                    <p className="reports-kpi-card__value">
                        {report.totalTasks}
                    </p>
                </article>
                <article className="reports-kpi-card">
                    <p className="reports-kpi-card__label">Завершено</p>
                    <p className="reports-kpi-card__value">
                        {report.doneTasks}
                    </p>
                </article>
                <article className="reports-kpi-card">
                    <p className="reports-kpi-card__label">В роботі</p>
                    <p className="reports-kpi-card__value">
                        {report.inProgressTasks}
                    </p>
                </article>
                <article className="reports-kpi-card">
                    <p className="reports-kpi-card__label">Прогрес</p>
                    <p className="reports-kpi-card__value">
                        {report.donePercent}%
                    </p>
                </article>
            </section>

            <section className="reports-page__content">
                <article className="reports-block">
                    <h2 className="reports-block__title">Статуси задач</h2>
                    <div className="reports-status-list">
                        {report.statusDistribution.map((row) => {
                            return (
                                <div
                                    key={row.status}
                                    className="reports-status-list__item"
                                >
                                    <div className="reports-status-list__row">
                                        <span>{STATUS_LABELS[row.status]}</span>
                                        <span>
                                            {row.count} ({row.percent}%)
                                        </span>
                                    </div>
                                    <div className="reports-status-list__bar">
                                        <div
                                            className="reports-status-list__bar-fill"
                                            style={{ width: `${row.percent}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </article>

                <article className="reports-block">
                    <h2 className="reports-block__title">Дедлайн та ризики</h2>
                    <div className="reports-risk-grid">
                        <div className="reports-risk-grid__item">
                            <p className="reports-risk-grid__label">
                                До дедлайну
                            </p>
                            <p className="reports-risk-grid__value">
                                {report.overdue
                                    ? `Прострочено на ${Math.abs(report.daysToDeadline)} дн.`
                                    : `${report.daysToDeadline} дн.`}
                            </p>
                        </div>

                        <div className="reports-risk-grid__item">
                            <p className="reports-risk-grid__label">
                                Задач в review
                            </p>
                            <p className="reports-risk-grid__value">
                                {report.reviewTasks} ({report.reviewShare}%
                                активних)
                            </p>
                        </div>

                        <div className="reports-risk-grid__item">
                            <p className="reports-risk-grid__label">
                                Оцінка ризику
                            </p>
                            <p
                                className={`reports-risk-grid__value ${
                                    report.riskLevel === "HIGH" ||
                                    report.overdue
                                        ? "reports-risk-grid__value--danger"
                                        : "reports-risk-grid__value--ok"
                                }`}
                            >
                                {riskLabel}
                            </p>
                        </div>
                    </div>
                </article>
            </section>

            <button
                className="reports-page__export-btn"
                disabled={isLoading}
                onClick={() => void handleExportPdf()}
            >
                Експорт у PDF
            </button>
        </div>
    );
};
