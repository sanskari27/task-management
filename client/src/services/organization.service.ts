import api from '@/lib/api';
import { organizationDetailsSchema } from '@/schema/organization';
import { TEmployee } from '@/types/employee';
import { z } from 'zod';

export default class OrganizationService {
	static async getOrganizationDetails(id: string) {
		try {
			const { data } = await api.get(`/organization/${id}`);
			return {
				id: data.details.id ?? '',
				name: data.details.name ?? '',
				domain: data.details.domain ?? '',
				industry: data.details.industry ?? '',
				logo: data.details.logo ?? '',
				timezone: data.details.timezone ?? '',
				address: {
					street: data.details?.address.street ?? '',
					city: data.details?.address.city ?? '',
					state: data.details?.address.state ?? '',
					country: data.details?.address.country ?? '',
					zip: data.details?.address.zip ?? '',
					_id: data.details?.address._id ?? '',
				},
				categories: (data.details.categories ?? []).map((category: any) => category),
				is_owner: data.details.is_owner ?? false,
			};
		} catch (error) {
			//ignore
		}
	}

	static async createOrganization(details: z.infer<typeof organizationDetailsSchema>) {
		try {
			const { data } = await api.post('/organization/create-organization', details);
			return data.organization.id;
		} catch (error) {
			return null;
		}
	}

	static async updateOrganization(id: string, details: z.infer<typeof organizationDetailsSchema>) {
		try {
			const { data } = await api.post(`/organization/${id}/update-details`, details);
			return data.organization.id;
		} catch (error) {
			return null;
		}
	}

	static async employeeList(
		organizationId: string,
		opts?: { managed: boolean }
	): Promise<TEmployee[] | null> {
		try {
			const { data } = await api.get('/organization/list-employees', {
				headers: {
					'X-Organization-ID': organizationId,
				},
				params: {
					managed: opts?.managed ?? false,
				},
			});

			return (data.employees ?? []).map((employee: any) => {
				return {
					id: (employee.employee_id as string) ?? '',
					organization_id: (employee.organization_id as string) ?? '',
					parent_id: (employee.parent_id as string) ?? '',
					can_create_others: (employee.can_create_others as boolean) ?? false,
					can_let_other_create: (employee.can_let_other_create as boolean) ?? false,
					name: (employee.name as string) ?? '',
					email: (employee.email as string) ?? '',
					phone: (employee.phone as string) ?? '',
				};
			});
		} catch (error) {
			return null;
		}
	}

	static async employeeTree(organizationId: string) {
		try {
			const { data } = await api.get('/organization/list-employees', {
				headers: {
					'X-Organization-ID': organizationId,
				},
			});

			return data.tree as {
				name: string;
				attributes: any;
				children: any[];
			};
		} catch (error) {
			return null;
		}
	}

	static async inviteEmployee(
		org_id: string,
		values: {
			email: string;
			can_create_others: boolean;
			can_let_others_create: boolean;
			parent_id?: string | undefined;
		}
	) {
		try {
			await api.post('/organization/add-to-organization', values, {
				headers: {
					'X-Organization-ID': org_id,
				},
			});

			return true;
		} catch (error) {
			return false;
		}
	}

	static async removeEmployee(org_id: string, emp_id: string) {
		try {
			await api.post(
				`/organization/remove-from-organization/${emp_id}`,
				{},
				{
					headers: {
						'X-Organization-ID': org_id,
					},
				}
			);

			return true;
		} catch (error) {
			return false;
		}
	}

	static async reconfigureOrganizationTree(
		org_id: string,
		updates: { emp_id: string; parent_id: string }[]
	) {
		try {
			await api.post(
				'/organization/reconfigure-positions',
				{
					positions: updates,
				},
				{
					headers: {
						'X-Organization-ID': org_id,
					},
				}
			);

			return true;
		} catch (error) {
			return false;
		}
	}
}
