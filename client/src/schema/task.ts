import { z } from 'zod';

export const taskDetailsSchema = z.object({
	title: z.string().min(1, {
		message: 'Title is required',
	}),
	description: z.string().min(1, {
		message: 'Description is required',
	}),
	assigned_separately: z.boolean(),
	assigned_to: z.array(z.string()).min(1, {
		message: 'Employee is required',
	}),
	category: z.string().min(1, {
		message: 'Category is required',
	}),
	priority: z.string({}),
	isRecurring: z.boolean(),
	recurrence: z.object({
		frequency: z.string(),
		start_date: z.date(),
		end_date: z.date(),
		weekdays: z.array(z.string()),
		monthdays: z.array(z.number()),
	}),
	due_date: z.date(),
	links: z.array(z.string()),
	files: z.array(z.string()),
	voice_notes: z.array(z.string()),
	remainders: z.array(
		z.object({
			remainder_type: z.string(),
			before: z.number(),
			before_type: z.string(),
		})
	),
});
