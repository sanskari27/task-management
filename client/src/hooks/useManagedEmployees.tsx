import OrganizationService from '@/services/organization.service';
import { TEmployee } from '@/types/employee';
import { useEffect, useState } from 'react';

export default function useManagedEMployees(org_id: string) {
	const [list, setList] = useState<TEmployee[]>([]);

	useEffect(() => {
		OrganizationService.employeeList(org_id, {
			managed: true,
		}).then((data) => {
			data && setList(data);
		});
	}, [org_id]);

	return list;
}
