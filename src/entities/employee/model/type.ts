export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    avatar: string;
    departmentId: string;
    departmentTitle: string;
}

export interface EmployeeResponse extends Employee {
    projectsCount: number;
    tasksCount: number;
    doneTasksCount: number;
}
