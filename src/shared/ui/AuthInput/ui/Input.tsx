import clsx from "clsx";
import type { FC, InputHTMLAttributes, ReactNode } from "react";

import "./input.scss";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    suffix?: ReactNode;
}

export const Input: FC<InputProps> = ({
    label,
    error,
    suffix,
    className,
    ...rest
}) => {
    return (
        <div className="input-wrapper">
            {label && <label className="input-wrapper__label">{label}</label>}
            <div className="input-wrapper__field">
                <input
                    className={clsx(
                        "input",
                        { "input--error": error },
                        className,
                    )}
                    {...rest}
                />
                {suffix && (
                    <span className="input-wrapper__suffix">{suffix}</span>
                )}
            </div>
            {error && <span className="input-wrapper__error">{error}</span>}
        </div>
    );
};
