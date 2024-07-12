import EmployeeService from '@/services/employee';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { Cookie, JWT_SECRET, REFRESH_SECRET, SESSION_EXPIRE_TIME } from '../config/const';
import { CustomError } from '../errors';
import AUTH_ERRORS from '../errors/auth-errors';
import { SessionService, UserService } from '../services';
import { idValidator, setCookie } from '../utils/ExpressUtils';

export default async function VerifySession(req: Request, res: Response, next: NextFunction) {
	const _auth_id = req.cookies[Cookie.Auth];
	const _refresh_id = req.cookies[Cookie.Refresh];
	const org_id = idValidator(req.headers['X-Organization-ID'] as string);
	const emp_id = idValidator(req.headers['X-Employee-ID'] as string);

	let session;

	if (!_auth_id) {
		return next(new CustomError(AUTH_ERRORS.SESSION_INVALIDATED));
	}
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

	if (req.headers['X-Organization-ID'] || req.headers['X-Employee-ID']) {
		if (org_id[0] && emp_id[0]) {
			req.locals.employeeService = await EmployeeService.getEmployeeService(org_id[1], emp_id[1]);
		} else {
			return next(
				new CustomError({
					STATUS: 400,
					TITLE: 'INVALID_HEADER',
					MESSAGE: 'Invalid X-Organization-ID & X-Employee-ID in headers.',
				})
			);
		}
	}

	return next();
}
