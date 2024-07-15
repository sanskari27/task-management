import { z } from 'zod';

export const signupSchema = z.object({
	email: z.string().email(),
	industry: z.string(),
	domain: z.string(),
	logo: z.string(),
	timeZone: z.string(),
	address: z.object({
		street: z.string(),
		city: z.string(),
		state: z.string(),
		country: z.string(),
		zip: z.string(),
	}),
});
