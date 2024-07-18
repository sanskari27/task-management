import api from '@/lib/api';

export default class AuthService {
	static async isUserAuthenticated() {
		try {
			await api.get('/auth/validate-auth');
			return true;
		} catch (error) {
			return false;
		}
	}

	static async login(email: string, password: string) {
		try {
			const { data } = await api.post('/auth/login', { email, password });
			return data.success;
		} catch (error) {
			return false;
		}
	}

	static async register(user: {
		email: string;
		password: string;
		firstName: string;
		lastName: string;
		phone: string;
	}) {
		try {
			await api.post('/auth/register', {
				email: user.email,
				password: user.password,
				name: `${user.firstName} ${user.lastName}`,
				phone: user.phone,
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	static async forgotPassword(email: string) {
		try {
			await api.post('/auth/forgot-password', {
				email,
				callbackURL: `${window.location.origin}/auth/reset-password`,
			});
			return true;
		} catch (error) {
			return false;
		}
	}

	static async resetPassword(token: string, password: string) {
		try {
			await api.post(`/auth/reset-password/${token}`, { password, keep_logged_in: true });
			return true;
		} catch (error) {
			return false;
		}
	}

	static async details(): Promise<{
		account: { name: string; email: string; phone: string };
		organizations: {
			org_id: string;
			emp_id: string;
			name: string;
			domain: string;
			industry: string;
			logo: string;
		}[];
	}> {
		try {
			const { data } = await api.get('/auth/details');
			return {
				account: {
					name: (data.account?.name as string) ?? '',
					email: (data.account?.email as string) ?? '',
					phone: (data.account?.phone as string) ?? '',
				},
				organizations: (data.organizations ?? []).map((org: any) => {
					return {
						org_id: (org.org_id as string) ?? '',
						emp_id: (org.emp_id as string) ?? '',
						name: (org.name as string) ?? '',
						domain: (org.domain as string) ?? '',
						industry: (org.industry as string) ?? '',
						logo: (org.logo as string) ?? '',
					};
				}),
			};
		} catch (error) {
			return {
				account: { name: '', email: '', phone: '' },
				organizations: [],
			};
		}
	}
}
