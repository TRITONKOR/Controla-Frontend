import { useState, type FC } from "react";
import { Input, type InputProps } from "../../AuthInput";

import EyeIcon from "@/assets/eye-off.png";

export const PasswordInput: FC<Omit<InputProps, "type">> = (props) => {
    const [visible, setVisible] = useState(false);

    return (
        <Input
            {...props}
            type={visible ? "text" : "password"}
            suffix={
                <img
                    src={EyeIcon}
                    alt="toggle password"
                    onClick={() => setVisible((v) => !v)}
                    style={{ cursor: "pointer" }}
                />
            }
        />
    );
};
