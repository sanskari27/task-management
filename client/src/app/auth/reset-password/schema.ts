import { z } from 'zod';

export const resetSchema = z
	.object({
		password: z.string().min(8),
		confirmPassword: z.string().min(8),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['password'],
	});
