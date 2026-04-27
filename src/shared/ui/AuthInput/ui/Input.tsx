import clsx from "clsx";
import type { FC, InputHTMLAttributes, ReactNode } from "react";

import "./input.scss";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    suffix?: ReactNode;
}

export const Input: FC<InputProps> = ({ label, error, className, ...rest }) => {
    return (
        <div className="input-wrapper">
            {label && <label className="input-wrapper__label">{label}</label>}
            <input
                className={clsx("input", { "input--error": error }, className)}
                {...rest}
            />
            {error && <span className="input-wrapper__error">{error}</span>}
        </div>
    );
};
