import { Cookie, REFRESH_SECRET } from '@/config/const';
import { StorageDB } from '@/db';
import { AUTH_ERRORS, COMMON_ERRORS, CustomError } from '@/errors';
import { sendPasswordResetEmail } from '@/provider/email';
import { UserService } from '@/services';
import EmployeeService from '@/services/employee';
import { Respond, setCookie } from '@/utils/ExpressUtils';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import {
	LoginValidationResult,
	RegisterValidationResult,
	ResetPasswordValidationResult,
	UpdatePasswordValidationResult,
} from './auth.validator';

export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function login(req: Request, res: Response, next: NextFunction) {
	const { email, password, latitude, longitude } = req.locals.data as LoginValidationResult;

	try {
		const { authToken, refreshToken } = await UserService.login(email, password, {
			latitude: latitude ?? 0,
			longitude: longitude ?? 0,
			platform: req.useragent?.platform || '',
			browser: req.useragent?.browser || '',
		});

		setCookie(res, {
			key: Cookie.Auth,
			value: authToken,
			expires: JWT_EXPIRE_TIME,
		});

		setCookie(res, {
			key: Cookie.Refresh,
			value: refreshToken,
			expires: SESSION_EXPIRE_TIME,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function forgotPassword(req: Request, res: Response, next: NextFunction) {
	const { email, callbackURL } = req.locals.data as ResetPasswordValidationResult;

	try {
		const token = await UserService.generatePasswordResetLink(email);

		const resetLink = `${callbackURL}?code=${token}`;
		const success = await sendPasswordResetEmail(email, resetLink);

		return Respond({
			res,
			status: success ? 200 : 400,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR));
	}
}

async function resetPassword(req: Request, res: Response, next: NextFunction) {
	const user_id = await StorageDB.getString(req.params.id);
	const { password, keep_logged_in } = req.locals.data as UpdatePasswordValidationResult;

	try {
		if (!user_id) {
			return res.send('Error resetting password');
		}

		const userService = await UserService.saveResetPassword(req.params.id, password);

		if (keep_logged_in) {
			const { authToken, refreshToken } = await userService.login({
				platform: req.useragent?.platform || '',
				browser: req.useragent?.browser || '',
			});

			setCookie(res, {
				key: Cookie.Auth,
				value: authToken,
				expires: JWT_EXPIRE_TIME,
			});

			setCookie(res, {
				key: Cookie.Refresh,
				value: refreshToken,
				expires: SESSION_EXPIRE_TIME,
			});
		}

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(COMMON_ERRORS.NOT_FOUND));
	}
}

async function register(req: Request, res: Response, next: NextFunction) {
	const { email, name, phone, password } = req.locals.data as RegisterValidationResult;
	try {
		const userService = await UserService.register(email, {
			name,
			phone,
			password,
		});

		const { authToken, refreshToken } = await userService.login({
			platform: req.useragent?.platform || '',
			browser: req.useragent?.browser || '',
		});

		setCookie(res, {
			key: Cookie.Auth,
			value: authToken,
			expires: JWT_EXPIRE_TIME,
		});

		setCookie(res, {
			key: Cookie.Refresh,
			value: refreshToken,
			expires: SESSION_EXPIRE_TIME,
		});

		return Respond({
			res,
			status: 200,
		});
	} catch (err) {
		return next(new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS));
	}
}

async function validateAuth(req: Request, res: Response, next: NextFunction) {
	return Respond({
		res,
		status: 200,
	});
}

async function details(req: Request, res: Response, next: NextFunction) {
	const { user, user_id } = req.locals;
	const details = user.getDetails();
	const employees = await EmployeeService.getInstancesOfUser(user_id);

	try {
		return Respond({
			res,
			status: 200,
			data: {
				account: details,
				organizations: await Promise.all(
					employees.map(async (emp) => {
						const org = await emp.getOrganizationService();
						return {
							org_id: emp.organization_id,
							emp_id: emp.employee_id,
							name: org.organizationDetails.name,
							domain: org.organizationDetails.domain,
							industry: org.organizationDetails.industry,
							logo: org.organizationDetails.logo,
							can_create_others: emp.can_create_others,
							can_let_others_create: emp.can_let_others_create,
							is_owner: org.organizationDetails.owner.toString() === user_id.toString(),
						};
					})
				),
			},
		});
	} catch (err) {
		if (err instanceof CustomError) {
			return next(err);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, err));
	}
}

async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		const _refresh_id = req.cookies[Cookie.Refresh];
		const decoded = verify(_refresh_id, REFRESH_SECRET) as JwtPayload;
		UserService.markLogout(decoded.id);
	} catch (err) {
		//ignored
	}
	res.clearCookie(Cookie.Auth);
	res.clearCookie(Cookie.Refresh);
	return Respond({
		res,
		status: 200,
	});
}

const Controller = {
	validateAuth,
	login,
	forgotPassword,
	resetPassword,
	register,
	logout,
	details,
};

export default Controller;
