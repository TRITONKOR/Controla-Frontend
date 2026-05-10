import { TaskPage } from "@/entities/task";
import { DashboardPage } from "@/pages/DashboardPage";
import { EmployeesPage } from "@/pages/EmployeesPage";
import { GreetingPage } from "@/pages/GreetingPage";
import { LoginPage } from "@/pages/LoginPage";
import { PendingApprovalPage } from "@/pages/PendingApprovalPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SidebarLayout } from "@/widgets/SidebarLayout";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { GuestOnlyRoute } from "./GuestOnlyRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { RootLayout } from "./RootLayout";
import { ROUTES } from "./routes";

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: ROUTES.GREETING,
                element: <GreetingPage />,
            },
            {
                path: ROUTES.LOGIN,
                element: (
                    <GuestOnlyRoute>
                        <LoginPage />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: ROUTES.REGISTER,
                element: (
                    <GuestOnlyRoute>
                        <RegisterPage />
                    </GuestOnlyRoute>
                ),
            },
            {
                path: ROUTES.PENDING_APPROVAL,
                element: <PendingApprovalPage />,
            },
            {
                element: (
                    <ProtectedRoute>
                        <SidebarLayout>
                            <Outlet />
                        </SidebarLayout>
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: ROUTES.HOME,
                        element: <ProjectsPage />,
                    },
                    {
                        path: ROUTES.DASHBOARD,
                        element: <DashboardPage />,
                    },
                    {
                        path: ROUTES.TASK,
                        element: <TaskPage />,
                    },
                    {
                        path: ROUTES.EMPLOYEES,
                        element: <EmployeesPage />,
                    },
                    {
                        path: ROUTES.REPORTS,
                        element: <ReportsPage />,
                    },
                    {
                        path: ROUTES.PROFILE,
                        element: <ProfilePage />,
                    },
                ],
            },
            {
                path: "*",
                element: <Navigate to={ROUTES.HOME} replace />,
            },
        ],
    },
]);
