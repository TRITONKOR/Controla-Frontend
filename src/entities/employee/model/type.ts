export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    departmentId: string;
    departmentTitle: string;
}

export interface EmployeeResponse extends Employee {
    projectsCount: number;
    productivity: number;
    assignedTasksLastMonth: number;
    completedTasksLastMonth: number;
}
