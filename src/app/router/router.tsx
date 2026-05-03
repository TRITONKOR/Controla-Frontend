import { DashboardPage } from "@/pages/DashboardPage";
import { EmployeesPage } from "@/pages/EmployeesPage";
import { GreetingPage } from "@/pages/GreetingPage";
import { LoginPage } from "@/pages/LoginPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { TasksPage } from "@/pages/TasksPage";
import { SidebarLayout } from "@/widgets/SidebarLayout";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { GuestOnlyRoute } from "./GuestOnlyRoute";
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
                element: (
                    <SidebarLayout>
                        <Outlet />
                    </SidebarLayout>
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
                        path: ROUTES.EMPLOYEES,
                        element: <EmployeesPage />,
                    },
                    {
                        path: ROUTES.TASKS,
                        element: <TasksPage />,
                    },
                    {
                        path: ROUTES.REPORTS,
                        element: <ReportsPage />,
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
