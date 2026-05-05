export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    GREETING: "/greeting",
    REGISTER: "/register",
    DASHBOARD: "/projects/:projectId/dashboard",
    EMPLOYEES: "/employees",
    PROJECT_EMPLOYEES: "/projects/:projectId/employees",
    PROJECTS: "/projects",
    CREATE_PROJECT: "/projects/create",
    REPORTS: "/reports",
    PROJECT_SETTINGS: "/projects/:projectId/settings",
    PENDING_APPROVAL: "/pending-approval",
} as const;
