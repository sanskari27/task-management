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
			await api.post('/auth/login', { email, password });
			return true;
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
}
