import { TaskStatus } from '@/config/const';
import DateUtils from '@/utils/DateUtils';
import { parseZodMessage } from '@/utils/ExpressUtils';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type CreateTaskType = {
	title: string;
	description: string;
	assign_separately: boolean;
	assigned_to: Types.ObjectId[];
	category: string;
	priority: 'low' | 'medium' | 'high';
	isRecurring: boolean;
	recurrence?: {
		frequency: 'daily' | 'weekly' | 'monthly';
		start_date: Date;
		end_date: Date;
		weekdays: (
			| 'monday'
			| 'tuesday'
			| 'wednesday'
			| 'thursday'
			| 'friday'
			| 'saturday'
			| 'sunday'
		)[];
		monthdays: string[];
	};
	due_date?: Date;
	links: string[];
	files: string[];
	voice_notes: string[];
	reminders: {
		reminder_type: 'email' | 'whatsapp';
		before: number;
		before_type: 'minutes' | 'hours' | 'days';
	}[];
};

export function CreateTaskValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z
		.object({
			title: z.string().min(1),
			description: z.string().min(1),
			assign_separately: z.boolean(),
			assigned_to: z
				.array(
					z
						.string()
						.refine((value) => Types.ObjectId.isValid(value))
						.transform((value) => new Types.ObjectId(value))
				)
				.min(1),
			category: z.string().min(1),
			priority: z.enum(['low', 'medium', 'high']),
			isRecurring: z.boolean(),
			recurrence: z
				.object({
					frequency: z.enum(['daily', 'weekly', 'monthly']),
					start_date: z.string().transform((val) => DateUtils.getMoment(val).toDate()),
					end_date: z.string().transform((val) => DateUtils.getMoment(val).toDate()),
					weekdays: z
						.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
						.array()
						.default([]),
					monthdays: z
						.array(
							z
								.string()
								.refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 31)
						)
						.default([]),
				})
				.optional(),
			due_date: z
				.string()
				.transform((val) => DateUtils.getMoment(val).toDate())
				.optional(),
			links: z.array(z.string().url()),
			files: z.array(z.string()),
			voice_notes: z.array(z.string()),
			reminders: z.array(
				z.object({
					reminder_type: z.enum(['email', 'whatsapp']),
					before: z.number(),
					before_type: z.enum(['minutes', 'hours', 'days']),
				})
			),
		})
		.refine((value) => {
			if (value.isRecurring) {
				if (!value.recurrence) return false;
				if (value.recurrence.frequency === 'weekly' && value.recurrence.weekdays.length === 0)
					return false;
				if (value.recurrence.frequency === 'monthly' && value.recurrence.monthdays.length === 0)
					return false;
			} else {
				if (!value.due_date) return false;
			}
			return true;
		});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: parseZodMessage(reqValidatorResult),
		})
	);
}

export type AssignTaskType = {
	assigned_to: Types.ObjectId[];
};

export function AssignTaskValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		assigned_to: z.array(z.string().refine((value) => Types.ObjectId.isValid(value))),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: parseZodMessage(reqValidatorResult),
		})
	);
}

export type FetchQueryType = {
	status?: TaskStatus;
	assigned_to?: Types.ObjectId[];
	categories?: string[];
	priority?: 'low' | 'medium' | 'high';
	frequency?: 'daily' | 'weekly' | 'monthly';
	search?: string;
	date_range?: {
		start: Date;
		end: Date;
	};
	created_by?: Types.ObjectId[];
};

export function FetchQueryValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z
		.object({
			start_date: z
				.string()
				.transform((val) => DateUtils.getMoment(val).startOf('day').toDate())
				.optional(),
			end_date: z
				.string()
				.transform((val) => DateUtils.getMoment(val).endOf('day').toDate())
				.optional(),
			assigned_to: z
				.string()
				.refine((val) => val.split(',').every((v) => Types.ObjectId.isValid(v)))
				.transform((val) => val.split(',').map((v) => new Types.ObjectId(v)))
				.optional(),
			created_by: z
				.string()
				.refine((val) => val.split(',').every((v) => Types.ObjectId.isValid(v)))
				.transform((val) => val.split(',').map((v) => new Types.ObjectId(v)))
				.optional(),
			categories: z
				.string()
				.refine((val) => val.split(','))
				.transform((val) => val.split(','))
				.optional(),
			search: z.string().optional(),
			priority: z.enum(['low', 'medium', 'high']).optional(),
			status: z.enum(['pending', 'completed', 'in_progress']).optional(),
			frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
		})
		.refine((value) => {
			if (!value.start_date && value.end_date) return false;
			else if (value.start_date && !value.end_date) return false;
			else if (value.start_date && value.end_date) {
				if (DateUtils.getMoment(value.start_date).isAfter(DateUtils.getMoment(value.end_date)))
					return false;
			}
			return true;
		});

	const reqValidatorResult = reqValidator.safeParse(req.query);

	if (reqValidatorResult.success) {
		const data = reqValidatorResult.data;
		req.locals.query = {
			...data,
			...(data.start_date &&
				data.end_date && {
					date_range: {
						start: data.start_date,
						end: data.end_date,
					},
				}),
		};
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_QUERY',
			MESSAGE: parseZodMessage(reqValidatorResult),
		})
	);
}

export type UpdateStatusType = {
	status: TaskStatus;
};

export function UpdateStatusValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		status: z.enum(['pending', 'completed', 'in_progress']),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: parseZodMessage(reqValidatorResult),
		})
	);
}

export type TaskUpdateType = {
	message: string;
	links: string[];
	files: string[];
	voice_notes: string[];
	status: TaskStatus;
};

export function TaskUpdateValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		message: z.string().optional(),
		links: z.array(z.string()).optional(),
		files: z.array(z.string()).optional(),
		voice_notes: z.array(z.string()).optional(),
		status: z.enum(['pending', 'completed', 'in_progress']).default('in_progress'),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data;
		return next();
	}

	return next(
		new CustomError({
			STATUS: 400,
			TITLE: 'INVALID_FIELDS',
			MESSAGE: parseZodMessage(reqValidatorResult),
		})
	);
}
