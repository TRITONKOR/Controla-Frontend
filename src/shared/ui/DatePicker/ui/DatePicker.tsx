import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import "./datePicker.scss";

interface DatePickerProps {
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export const DatePicker = ({
    label,
    value,
    onChange,
    error,
    disabled,
}: DatePickerProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = value ? new Date(value + "T00:00:00") : undefined;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const displayValue = selected ? format(selected, "dd.MM.yyyy") : "";

    const handleSelect = (date: Date | undefined) => {
        if (!date) return;
        onChange(format(date, "yyyy-MM-dd"));
        setOpen(false);
    };

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="date-picker" ref={ref}>
            {label && <label className="date-picker__label">{label}</label>}
            <button
                type="button"
                className={`date-picker__trigger${error ? " date-picker__trigger--error" : ""}${disabled ? " date-picker__trigger--disabled" : ""}`}
                onClick={() => !disabled && setOpen((o) => !o)}
                disabled={disabled}
            >
                <span
                    className={displayValue ? "" : "date-picker__placeholder"}
                >
                    {displayValue || "Оберіть дату"}
                </span>
                <svg
                    className="date-picker__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            </button>
            {error && <span className="date-picker__error">{error}</span>}
            {open && (
                <div className="date-picker__popover">
                    <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleSelect}
                        disabled={{ before: tomorrow }}
                        locale={uk}
                        defaultMonth={selected ?? tomorrow}
                    />
                </div>
            )}
        </div>
    );
};
