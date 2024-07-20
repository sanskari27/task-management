'use client';

import { Employee } from '@/app/organizations/[org_id]/employees/table';
import * as React from 'react';

const EmployeesContext = React.createContext<Employee[]>([]);

export function EmployeesProvider({
	children,
	data,
}: {
	children: React.ReactNode;
	data: Employee[];
}) {
	return <EmployeesContext.Provider value={data}>{children}</EmployeesContext.Provider>;
}

export const useEmployees = () => React.useContext(EmployeesContext);
