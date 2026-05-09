import clsx from "clsx";
import { useId, useRef, useState, type ChangeEvent, type FC } from "react";

import "./fileUpload.scss";

export interface FileUploadProps {
    label?: string;
    buttonText?: string;
    helperText?: string;
    error?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    maxFileSizeMb?: number;
    files?: File[];
    className?: string;
    onFilesChange?: (files: File[]) => void;
}

export const FileUpload: FC<FileUploadProps> = ({
    label,
    buttonText = "Обрати файл",
    helperText,
    error,
    accept,
    multiple = false,
    disabled,
    maxFileSizeMb,
    files,
    className,
    onFilesChange,
}) => {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [internalFiles, setInternalFiles] = useState<File[]>([]);
    const [validationError, setValidationError] = useState<string>("");

    const resolvedFiles = files ?? internalFiles;

    const setFiles = (nextFiles: File[]) => {
        if (files === undefined) {
            setInternalFiles(nextFiles);
        }
        onFilesChange?.(nextFiles);
    };

    const validateFiles = (nextFiles: File[]) => {
        if (!maxFileSizeMb) {
            return nextFiles;
        }

        const maxSize = maxFileSizeMb * 1024 * 1024;
        const validFiles = nextFiles.filter((file) => file.size <= maxSize);

        if (validFiles.length !== nextFiles.length) {
            setValidationError(`Максимальний розмір файлу: ${maxFileSizeMb}MB`);
        } else {
            setValidationError("");
        }

        return validFiles;
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        const validFiles = validateFiles(selectedFiles);
        const nextFiles = multiple ? validFiles : validFiles.slice(0, 1);

        setFiles(nextFiles);

        event.target.value = "";
    };

    const removeFile = (index: number) => {
        const nextFiles = resolvedFiles.filter(
            (_, fileIndex) => fileIndex !== index,
        );
        setFiles(nextFiles);
        setValidationError("");
    };

    return (
        <div className={clsx("file-upload", className)}>
            {label && (
                <label htmlFor={inputId} className="file-upload__label">
                    {label}
                </label>
            )}

            <input
                id={inputId}
                ref={inputRef}
                className="file-upload__input"
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={handleInputChange}
            />

            <button
                type="button"
                className="file-upload__button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
            >
                {buttonText}
            </button>

            {helperText && <p className="file-upload__helper">{helperText}</p>}

            {resolvedFiles.length > 0 && (
                <ul className="file-upload__list">
                    {resolvedFiles.map((file, index) => (
                        <li
                            key={`${file.name}-${index}`}
                            className="file-upload__item"
                        >
                            <span className="file-upload__name">
                                {file.name}
                            </span>
                            <button
                                type="button"
                                className="file-upload__remove"
                                onClick={() => removeFile(index)}
                                aria-label={`Видалити файл ${file.name}`}
                            >
                                Видалити
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {(error || validationError) && (
                <span className="file-upload__error">
                    {error || validationError}
                </span>
            )}
        </div>
    );
};
