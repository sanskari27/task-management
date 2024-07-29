import { ADMIN_EMAIL } from '@/config/const';
import { AccountDB, IAccount, SessionDB, StorageDB } from '@/db';
import { AUTH_ERRORS, CustomError } from '@/errors';
import { EmailSubjects, EmailTemplates, sendEmail } from '@/provider/email';
import { IDType } from '@/types';
import { filterUndefinedKeys, generateNewPassword } from '@/utils/ExpressUtils';
import { randomBytes } from 'crypto';
import SessionService from './session';

type SessionDetails = {
	ipAddress?: string;
	platform?: string;
	browser?: string;
	latitude?: number;
	longitude?: number;
};

export default class UserService {
	private _user_id: IDType;
	private _account: IAccount;

	public constructor(account: IAccount) {
		this._user_id = account._id;
		this._account = account;
	}

	static async getUserService(str: IDType | string) {
		let account;
		if (typeof str === 'string') {
			account = await AccountDB.findOne({
				email: str,
			});
		} else {
			account = await AccountDB.findById(str);
		}

		if (!account) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		return new UserService(account);
	}

	static async getOrCreate(email: string) {
		try {
			return await UserService.getUserService(email);
		} catch (err) {
			return UserService.register(email, {
				name: email.split('@')[0],
			});
		}
	}

	static async login(email: string, password: string, opts: SessionDetails) {
		const account = await AccountDB.findOne({ email }).select('+password');

		if (account === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const password_matched = await account.verifyPassword(password);
		if (!password_matched) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const session = await SessionService.createSession(account._id, opts);

		return {
			authToken: session.authToken,
			refreshToken: session.refreshToken,
			userService: new UserService(account),
		};
	}

	async login(opts: SessionDetails) {
		const session = await SessionService.createSession(this._user_id, opts);

		return {
			authToken: session.authToken,
			refreshToken: session.refreshToken,
			userService: this,
		};
	}

	getUser() {
		return this._account;
	}

	async updateDetails(opts: { name?: string; email?: string; phone?: string }) {
		const update: any = filterUndefinedKeys(opts);

		await AccountDB.updateOne(
			{
				_id: this._user_id,
			},
			update
		);
		return {
			name: update.name ?? this._account.name,
			email: update.email ?? this._account.email,
			phone: update.phone ?? this._account.phone,
		};
	}

	getDetails() {
		const details = {
			name: this._account.name,
			email: this._account.email,
			phone: this._account.phone,
		};

		return details;
	}

	static async register(
		email: string,
		opts: {
			name?: string;
			phone?: string;
			password?: string;
		}
	) {
		try {
			const password = opts.password ?? generateNewPassword();
			const user = await AccountDB.create({
				email,
				password,
				name: opts.name,
				phone: opts.phone,
			});

			if (!opts.password) {
				const { token, name } = await UserService.generatePasswordResetLink(email);
				const resetLink = `https://task.wautopilot.com/auth/reset-password?code=${token}`;
				sendEmail(email, {
					subject: EmailSubjects.Signup,
					html: EmailTemplates.signupTemplate(name, resetLink),
				});
			}
			return new UserService(user);
		} catch (err) {
			throw new CustomError(AUTH_ERRORS.USER_ALREADY_EXISTS);
		}
	}

	static async generatePasswordResetLink(email: string) {
		const user = await AccountDB.findOne({ email }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const token = randomBytes(16).toString('hex');

		await StorageDB.setString(token, user._id.toString());
		return { token, name: user.name };
	}

	static async saveResetPassword(token: string, password: string) {
		const id = await StorageDB.getString(token);

		if (!id) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		const user = await AccountDB.findOne({ _id: id }).select('+password');
		if (user === null) {
			throw new CustomError(AUTH_ERRORS.USER_NOT_FOUND_ERROR);
		}

		user.password = password;
		await user.save();

		await StorageDB.deleteOne({
			key: token,
		});

		return new UserService(user);
	}

	static async markLogout(token: string) {
		await SessionDB.deleteOne({
			refreshToken: token,
		});
	}

	public get userId() {
		return this._user_id;
	}

	public get account() {
		return this._account;
	}

	public get isAdmin() {
		return this._account.email === ADMIN_EMAIL;
	}
}
