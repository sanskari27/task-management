import { z } from 'zod';

export const signupSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	firstName: z.string(),
	lastName: z.string(),
	phone: z.string().min(10),
});
