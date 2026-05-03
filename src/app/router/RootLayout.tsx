import { HeaderLayout } from "@/widgets/HeaderLayout";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
    return (
        <HeaderLayout>
            <Outlet />
        </HeaderLayout>
    );
};
