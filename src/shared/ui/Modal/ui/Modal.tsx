import { useEffect, type FC, type ReactNode } from "react";
import { createPortal } from "react-dom";

import "./modal.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="modal" role="dialog" aria-modal="true">
                <div className="modal__header">
                    {title && <h2 className="modal__title">{title}</h2>}
                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        aria-label="Закрити"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="modal__body">{children}</div>
            </div>
        </div>,
        document.body,
    );
};
