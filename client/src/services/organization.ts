import api from '@/lib/api';

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
}
