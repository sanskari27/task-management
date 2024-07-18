import api from '@/lib/api';
import { organizationDetailsSchema } from '@/schema/organization';
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

	static async employeeList(organizationId: string) {
		try {
			const { data } = await api.get('/organization/employee-list', {
				headers: {
					'X-Organization-ID': organizationId,
				},
			});

			console.log(data.employees);
			return data.employees;
		} catch (error) {
			return null;
		}
	}
}
