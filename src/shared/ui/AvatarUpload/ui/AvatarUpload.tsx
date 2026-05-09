import { useEffect, useMemo, useState, type FC } from "react";

import { FileUpload } from "@/shared/ui/FileUpload";

import "./avatarUpload.scss";

export interface AvatarUploadProps {
    label?: string;
    file?: File | null;
    previewUrl?: string | null;
    error?: string;
    disabled?: boolean;
    maxFileSizeMb?: number;
    onChange?: (file: File | null) => void;
}

export const AvatarUpload: FC<AvatarUploadProps> = ({
    label = "Фото профілю",
    file,
    previewUrl,
    error,
    disabled,
    maxFileSizeMb = 5,
    onChange,
}) => {
    const [internalFile, setInternalFile] = useState<File | null>(null);

    const resolvedFile = file === undefined ? internalFile : file;

    const generatedPreviewUrl = useMemo(() => {
        if (!resolvedFile) {
            return null;
        }

        return URL.createObjectURL(resolvedFile);
    }, [resolvedFile]);

    useEffect(() => {
        return () => {
            if (generatedPreviewUrl) {
                URL.revokeObjectURL(generatedPreviewUrl);
            }
        };
    }, [generatedPreviewUrl]);

    const resolvedPreview = generatedPreviewUrl ?? previewUrl ?? null;

    const handleFilesChange = (files: File[]) => {
        const nextFile = files[0] ?? null;

        if (file === undefined) {
            setInternalFile(nextFile);
        }

        onChange?.(nextFile);
    };

    return (
        <div className="avatar-upload">
            <div className="avatar-upload__preview">
                {resolvedPreview ? (
                    <img
                        src={resolvedPreview}
                        alt="Avatar preview"
                        className="avatar-upload__image"
                    />
                ) : (
                    <div className="avatar-upload__placeholder">Немає фото</div>
                )}
            </div>

            <FileUpload
                label={label}
                buttonText="Завантажити фото"
                helperText={`PNG, JPG, WEBP до ${maxFileSizeMb}MB`}
                accept="image/png,image/jpeg,image/webp"
                maxFileSizeMb={maxFileSizeMb}
                files={resolvedFile ? [resolvedFile] : []}
                error={error}
                disabled={disabled}
                onFilesChange={handleFilesChange}
            />
        </div>
    );
};
