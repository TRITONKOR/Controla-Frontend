import { useState, type FC } from "react";
import { Input, type InputProps } from "../../AuthInput";

import eyeOff from "@/assets/eye-off.png";
import eye from "@/assets/eye.png";

export const PasswordInput: FC<Omit<InputProps, "type">> = (props) => {
    const [visible, setVisible] = useState(false);

    return (
        <Input
            {...props}
            type={visible ? "text" : "password"}
            suffix={
                <img
                    src={visible ? eye : eyeOff}
                    alt="toggle password"
                    onClick={() => setVisible((v) => !v)}
                    style={{ cursor: "pointer" }}
                />
            }
        />
    );
};
