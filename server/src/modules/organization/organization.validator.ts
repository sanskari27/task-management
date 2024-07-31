import DateUtils from '@/utils/DateUtils';
import { parseZodMessage } from '@/utils/ExpressUtils';
import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { z } from 'zod';
import { CustomError } from '../../errors';

export type CreateOrganizationType = {
	code: string;
	name: string;
	industry: string;
	domain?: string;
	logo: string;
	address: {
		street: string;
		city: string;
		state: string;
		zip: string;
		country: string;
	};
	timezone: string;
};

export type UpdateOrganizationType = Partial<Omit<CreateOrganizationType, 'code'>>;

export async function CreateOrganizationValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		code: z.string().length(8),
		name: z.string().min(1),
		industry: z.string().min(1),
		domain: z.string().optional(),
		logo: z.string().default(''),
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
		timezone: z.string().refine((value) => DateUtils.timezones.includes(value)),
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

export async function UpdateOrganizationValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		name: z.string().optional(),
		industry: z.string().optional(),
		domain: z.string().optional(),
		logo: z.string().optional(),
		address: z
			.object({
				street: z.string().default(''),
				city: z.string().default(''),
				state: z.string().default(''),
				zip: z.string().default(''),
				country: z.string().default(''),
			})
			.optional(),
		timezone: z
			.string()
			.refine((value) => DateUtils.timezones.includes(value))
			.optional(),
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

export type InviteToOrganizationType = {
	email: string;
	parent_id?: Types.ObjectId;
	can_create_others: boolean;
	can_let_others_create: boolean;
};

export async function InviteToOrganizationValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const reqValidator = z.object({
		email: z.string().email(),
		parent_id: z
			.string()
			.refine((val) => Types.ObjectId.isValid(val))
			.transform((val) => new Types.ObjectId(val))
			.optional(),
		can_create_others: z.boolean().default(false),
		can_let_others_create: z.boolean().default(false),
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

export type UpdatePermissionType = {
	can_create_others: boolean;
	can_let_others_create: boolean;
};

export async function UpdatePermissionValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		can_create_others: z.boolean().default(false),
		can_let_others_create: z.boolean().default(false),
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

export async function RemoveFromOrganizationValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const reqValidator = z.object({
		email: z.string().email(),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.email;
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

export type ReconfigurePositionsType = {
	positions: {
		emp_id: Types.ObjectId;
		parent_id: Types.ObjectId;
	}[];
};

export async function ReconfigurePositionsValidator(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const reqValidator = z.object({
		positions: z.array(
			z.object({
				emp_id: z
					.string()
					.refine((val) => Types.ObjectId.isValid(val))
					.transform((val) => new Types.ObjectId(val)),
				parent_id: z
					.string()
					.refine((val) => Types.ObjectId.isValid(val))
					.transform((val) => new Types.ObjectId(val)),
			})
		),
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

export async function CategoriesValidator(req: Request, res: Response, next: NextFunction) {
	const reqValidator = z.object({
		categories: z.array(z.string()),
	});

	const reqValidatorResult = reqValidator.safeParse(req.body);

	if (reqValidatorResult.success) {
		req.locals.data = reqValidatorResult.data.categories;
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
