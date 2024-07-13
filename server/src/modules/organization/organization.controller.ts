import { COMMON_ERRORS, CustomError } from '@/errors';
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
	const { id } = req.locals;
	const data = req.locals.data as UpdateOrganizationType;

	const org = await OrganizationService.getInstance(id);

	const details = await org.updateDetails(data);

	return Respond({
		res,
		status: 200,
		data: {
			organization: details,
		},
	});
}

async function listEmployees(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

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

	await employeeService.removeFromOrganization(id);

	return Respond({
		res,
		status: 200,
		data: {
			message: 'User removed from organization successfully.',
		},
	});
}

async function reconfigurePositions(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	const data = req.locals.data as ReconfigurePositionsType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

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
}

const Controller = {
	createOrganization,
	inviteToOrganization,
	removeFromOrganization,
	reconfigurePositions,
	updateDetails,
	listEmployees,
};

export default Controller;
