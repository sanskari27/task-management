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
	const { employeeService } = req.locals;
	const data = req.locals.data as UpdateOrganizationType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}
	const org = await OrganizationService.getInstance(employeeService.organization_id);

	const details = await org.updateDetails(data);

	return Respond({
		res,
		status: 200,
		data: {
			organization: details,
		},
	});
}

async function inviteToOrganization(req: Request, res: Response, next: NextFunction) {
	const { id, employeeService } = req.locals;
	const data = req.locals.data as InviteToOrganizationType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	let org, user;
	try {
		org = await OrganizationService.getInstance(id);
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}

	try {
		user = await UserService.getOrCreate(data.email);
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}

	await employeeService.invite(user.userId, {
		parent: data.parent_id,
		can_create_others: data.can_create_others,
		can_let_others_create: data.can_let_others_create,
	});

	await sendOrganizationInviteEmail(data.email, org.organizationDetails.name);

	return Respond({
		res,
		status: 200,
		data: {
			message: 'User invited to organization successfully.',
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
	reconfigurePositions,
	updateDetails,
};

export default Controller;
