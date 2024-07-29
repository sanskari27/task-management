import EmployeeService from '@/services/employee';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Cookie, JWT_SECRET, REFRESH_SECRET, SESSION_EXPIRE_TIME } from '../config/const';
import { COMMON_ERRORS, CustomError } from '../errors';
import AUTH_ERRORS from '../errors/auth-errors';
import { SessionService, UserService } from '../services';
import { idValidator, setCookie } from '../utils/ExpressUtils';

export default async function VerifySession(req: Request, res: Response, next: NextFunction) {
	const _auth_id = req.cookies[Cookie.Auth];
	const _refresh_id = req.cookies[Cookie.Refresh];
	const org_id = idValidator(req.headers['x-organization-id'] as string);

	let session;

	try {
		const decoded = verify(_auth_id, JWT_SECRET) as JwtPayload;
		session = await SessionService.findSessionById(decoded.id);
	} catch (err) {
		try {
			const decoded = verify(_refresh_id, REFRESH_SECRET) as JwtPayload;
			session = await SessionService.findSessionByRefreshToken(decoded.id);
			setCookie(res, {
				key: Cookie.Auth,
				value: session.authToken,
				expires: SESSION_EXPIRE_TIME,
			});
		} catch (err) {
			return next(new CustomError(AUTH_ERRORS.SESSION_INVALIDATED));
		}
	}

	req.locals.user = await UserService.getUserService(session.userId);
	req.locals.user_id = req.locals.user.account._id;

	if (req.headers['x-organization-id']) {
		try {
			if (org_id[0]) {
				req.locals.employeeService = await EmployeeService.getEmployeeService(
					org_id[1],
					req.locals.user_id
				);
			} else {
				throw new Error();
			}
		} catch (err) {
			return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
		}
	}

	return next();
}

export async function VerifyAdmin(req: Request, res: Response, next: NextFunction) {
	if (!req.locals.user.isAdmin) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}

	return next();
}
