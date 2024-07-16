import { z } from 'zod';

export const organizationSchema = z.object({
	name: z.string().min(1),
	industry: z.string().min(1),
	domain: z.string().optional(),
	logo: z.string().min(1),
	address: z
		.object({
			street: z.string().default(''),
			city: z.string().default(''),
			state: z.string().default(''),
			zip: z.string().default(''),
			country: z.string().default(''),
		})
		.default({
			street: '',
			city: '',
			state: '',
			zip: '',
			country: '',
		}),
	timezone: z.string(),
});
