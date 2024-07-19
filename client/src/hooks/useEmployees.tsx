'use client';
import { Employee } from '@/app/organizations/[org_id]/employees/table';
import OrganizationService from '@/services/organization.service';
import { useEffect, useState } from 'react';

export default function useEmployees(organizationId: string) {
	const [employees, setEmployees] = useState<Employee[]>([]);

	useEffect(() => {
		OrganizationService.employeeList(organizationId).then((data) => {
			if (data) {
				setEmployees(data);
			}
		});
	}, [organizationId]);

	return employees;
}
