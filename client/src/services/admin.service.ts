import api from '@/lib/api';

export default class AdminService {
	static async listOrganizations() {
		try {
			const { data } = await api.get('/organization');
			return (data.organizations ?? []).map((organization: any) => {
				return {
					id: (organization.id as string) ?? '',
					name: (organization.name as string) ?? '',
					industry: (organization.industry as string) ?? '',
					domain: (organization.domain as string) ?? '',
					logo: (organization.logo as string) ?? '',
					address: {
						street: (organization.address.street as string) ?? '',
						city: (organization.address.city as string) ?? '',
						state: (organization.address.state as string) ?? '',
						zip: (organization.address.zip as string) ?? '',
						country: (organization.address.country as string) ?? '',
						_id: (organization.address._id as string) ?? '',
					},
					timezone: (organization.timezone as string) ?? '',
					categories: (organization.categories ?? []).map((category: any) => category as string),
					owner: {
						id: (organization.owner.id as string) ?? '',
						name: (organization.owner.name as string) ?? '',
						email: (organization.owner.email as string) ?? '',
						phone: (organization.owner.phone as string) ?? '',
					},
					total_employees: (organization.total_employees as number) ?? 0,
				};
			});
		} catch (error) {
			return null;
		}
	}

	static async listUsers() {
		try {
			const { data } = await api.get(`/admin/users`);
			return (data.users ?? []).map((user: any) => {
				return {
					name: (user.name as string) ?? '',
					email: (user.email as string) ?? '',
					phone: (user.phone as string) ?? '',
					organizations: (user.organizations ?? []).map((organization: any) => {
						return {
							org_id: (organization.org_id as string) ?? '',
							name: (organization.name as string) ?? '',
							logo: (organization.logo as string) ?? '',
							is_owner: (organization.is_owner as boolean) ?? false,
						};
					}),
				};
			});
		} catch (error) {
			return null;
		}
	}
}
