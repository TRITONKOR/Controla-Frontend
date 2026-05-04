import {
    EmployeesList,
    employeeApi,
    useEmployeeStore,
    type EmployeeResponse,
} from "@/entities/employee";
import { useProjectStore } from "@/entities/project";
import { useEffect, useState } from "react";

import "./employeesPage.scss";

export const EmployeesPage = () => {
    const selectedProject = useProjectStore((state) => state.selectedProject);
    const setSelectedEmployee = useEmployeeStore(
        (state) => state.setSelectedEmployee,
    );

    const [employees, setEmployees] = useState<EmployeeResponse[]>([]);

    useEffect(() => {
        if (selectedProject) {
            //employeeApi.getAll().then(setEmployees).catch(console.error);
        } else {
            employeeApi.getAll().then(setEmployees).catch(console.error);
        }
    }, [selectedProject]);

    const handleEmployeeSelect = (employee: EmployeeResponse) => {
        setSelectedEmployee(employee);
    };

    return (
        <div className="employees">
            <div className="employees__header">
                <h1>Співробітники</h1>
            </div>
            <div className="employees__content">
                <EmployeesList
                    onEmployeeSelect={handleEmployeeSelect}
                    employees={employees}
                />
            </div>
        </div>
    );
};
