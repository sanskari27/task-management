import { AUTH_ERRORS, COMMON_ERRORS, CustomError } from '@/errors';
import { sendOrganizationInviteEmail } from '@/provider/email';
import { UserService } from '@/services';
import OrganizationService from '@/services/organization';
import { Respond } from '@/utils/ExpressUtils';
import { NextFunction, Request, Response } from 'express';
import {
	CreateOrganizationType,
	InviteToOrganizationType,
	ReconfigurePositionsType,
	UpdateOrganizationType,
} from './organization.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function createOrganization(req: Request, res: Response, next: NextFunction) {
	const { user_id } = req.locals;
	const data = req.locals.data as CreateOrganizationType;
	const org = await OrganizationService.createOrganization({ ...data, owner: user_id });

	await org.addEmployee({
		account_id: user_id,
		can_create_others: true,
		can_let_others_create: true,
	});

	return Respond({
		res,
		status: 200,
		data: {
			organization: org.organizationDetails,
		},
	});
}

async function updateDetails(req: Request, res: Response, next: NextFunction) {
	const { id, user_id } = req.locals;
	const data = req.locals.data as UpdateOrganizationType;
	try {
		const org = await OrganizationService.getInstance(id);

		if (org.owner_id.toString() !== user_id.toString()) {
			return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
		}

		const details = await org.updateDetails(data);

		return Respond({
			res,
			status: 200,
			data: {
				organization: details,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function listEmployees(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}
	try {
		const org = await employeeService.getOrganizationService();

		const employees = await org.getEmployees();
		const details = await Promise.all(employees.map(async (emp) => await emp.getDetails()));

		return Respond({
			res,
			status: 200,
			data: {
				employees: details,
				tree: await org.getOrganizationTree(),
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function inviteToOrganization(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	const data = req.locals.data as InviteToOrganizationType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	try {
		const org = await OrganizationService.getInstance(employeeService.organization_id);
		const user = await UserService.getOrCreate(data.email);

		await employeeService.invite(user.userId, {
			parent: data.parent_id,
			can_create_others: data.can_create_others,
			can_let_others_create: data.can_let_others_create,
		});

		sendOrganizationInviteEmail(data.email, org.organizationDetails.name);

		return Respond({
			res,
			status: 200,
			data: {
				message: 'User invited to organization successfully.',
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		console.log(err);

		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function removeFromOrganization(req: Request, res: Response, next: NextFunction) {
	const { id, employeeService } = req.locals;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}
	try {
		await employeeService.removeFromOrganization(id);

		return Respond({
			res,
			status: 200,
			data: {
				message: 'User removed from organization successfully.',
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function reconfigurePositions(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	const data = req.locals.data as ReconfigurePositionsType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}
	try {
		const promises = data.positions.map(async ({ emp_id, parent_id }) => {
			await employeeService.reconfigurePosition({
				emp_id,
				parent: parent_id,
			});
		});

		await Promise.all(promises);

		return Respond({
			res,
			status: 200,
			data: {
				message: 'Positions reconfigured successfully.',
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function details(req: Request, res: Response, next: NextFunction) {
	const { id } = req.locals;
	try {
		const org = await OrganizationService.getInstance(id);

		return Respond({
			res,
			status: 200,
			data: {
				details: org.organizationDetails,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function categories(req: Request, res: Response, next: NextFunction) {
	const { id } = req.locals;

	try {
		const org = await OrganizationService.getInstance(id);

		return Respond({
			res,
			status: 200,
			data: {
				categories: org.organizationDetails.categories,
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function updateCategories(req: Request, res: Response, next: NextFunction) {
	const { id, data } = req.locals;

	try {
		const org = await OrganizationService.getInstance(id);
		await org.updateCategories(data as string[]);

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

const Controller = {
	createOrganization,
	inviteToOrganization,
	removeFromOrganization,
	reconfigurePositions,
	updateDetails,
	listEmployees,
	details,
	categories,
	updateCategories,
};

export default Controller;
