import { z } from 'zod';

export const signupSchema = z.object({
	email: z.string().email({
		message: 'Invalid email address',
	}),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters',
	}),
	firstName: z.string({
		message: 'First name is required',
	}),
	lastName: z.string({
		message: 'Last name is required',
	}),
	phone: z.string().min(10, {
		message: 'Phone number must be at least 10 characters',
	}),
});
