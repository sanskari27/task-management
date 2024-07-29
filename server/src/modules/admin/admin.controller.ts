import { StorageDB } from '@/db';
import { COMMON_ERRORS, CustomError } from '@/errors';
import { UserService } from '@/services';
import EmployeeService from '@/services/employee';
import OrganizationService from '@/services/organization';
import TaskService from '@/services/task';
import { Respond } from '@/utils/ExpressUtils';
import { NextFunction, Request, Response } from 'express';

export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function listUsers(req: Request, res: Response, next: NextFunction) {
	const users = await UserService.listUsers();

	const details = users.map(async (user) => {
		const employees = await EmployeeService.getInstancesOfUser(user.userId);
		return {
			...user.getDetails(),
			organizations: await Promise.all(
				employees.map(async (emp) => {
					const org = await emp.getOrganizationService();
					return {
						org_id: emp.organization_id,
						name: org.organizationDetails.name,
						logo: org.organizationDetails.logo,
						is_owner: org.organizationDetails.owner.toString() === user.userId.toString(),
					};
				})
			),
		};
	});

	try {
		return Respond({
			res,
			status: 200,
			data: {
				users: await Promise.all(details),
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

const Controller = {
	listUsers,
	dashboardDetails,
};

async function dashboardDetails(req: Request, res: Response, next: NextFunction) {
	try {
		return Respond({
			res,
			status: 200,
			data: {
				users: await UserService.totalUsers(),
				organizations: (await OrganizationService.listOrganizations()).length,
				emailSent: await StorageDB.getObject('email_sent'),
				whatsappSent: await StorageDB.getObject('whatsapp_sent'),
				tasks: await TaskService.monthlyCreatedTasks(),
				dailyTasks: await TaskService.dailyCreatedTasks(),
			},
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR));
	}
}

export default Controller;
