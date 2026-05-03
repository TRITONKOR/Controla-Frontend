import { PageLayout } from "@/widgets/PageLayout";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
    return (
        <PageLayout>
            <Outlet />
        </PageLayout>
    );
};
