export const DATABASE_URL = process.env.DATABASE_URL as string;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_WINDOWS = process.env.OS === 'WINDOWS';

export const PORT = process.env.PORT !== undefined ? process.env.PORT : undefined;

export const JWT_SECRET = process.env.JWT_SECRET ?? 'jwt-secret';
export const JWT_EXPIRE = process.env.JWT_EXPIRE ?? '3minutes';
export const REFRESH_SECRET = process.env.REFRESH_SECRET ?? 'refresh-secret';
export const REFRESH_EXPIRE = process.env.REFRESH_EXPIRE ?? '28days';
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60;

export const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
export const META_VERIFY_STRING = process.env.META_VERIFY_STRING ?? '';
export const META_VERIFY_USER_STRING = process.env.META_VERIFY_USER_STRING ?? '';

export const META_AUTH_TOKEN = process.env.META_AUTH_TOKEN ?? '';
export const META_WA_ID = process.env.META_WA_ID ?? '';
export const META_PHONE_ID = process.env.META_PHONE_ID ?? '';

export const RAZORPAY_API_KEY = process.env.RAZORPAY_API_KEY ?? '';
export const RAZORPAY_API_SECRET = process.env.RAZORPAY_API_SECRET ?? '';
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? '';

export const LOGO_PATH = '/static/assets/logo-primary.svg';

export const SHORT_LINK_REDIRECT = 'https://open.wautopilot.com/';

export enum Cookie {
	Auth = 'auth-cookie',
	Refresh = 'refresh-cookie',
}
export enum UserLevel {
	USER = 20,
	WhiteLabel = 30,
	Master = 100,
}

export enum Path {
	Misc = '/static/misc/',
	Media = '/static/media/',
}

export const Permissions = {
	phonebook: {
		create: 'phonebook.create',
		update: 'phonebook.update',
		delete: 'phonebook.delete',
		export: 'phonebook.export',
	},
	chatbot: {
		create: 'chatbot.create',
		update: 'chatbot.update',
		delete: 'chatbot.delete',
		export: 'chatbot.export',
	},
	chatbot_flow: {
		create: 'chatbot_flow.create',
		update: 'chatbot_flow.update',
		delete: 'chatbot_flow.delete',
		export: 'chatbot_flow.export',
	},
	broadcast: {
		create: 'broadcast.create',
		update: 'broadcast.update',
		report: 'broadcast.report',
		export: 'broadcast.export',
	},
	recurring: {
		create: 'recurring.create',
		update: 'recurring.update',
		delete: 'recurring.delete',
		export: 'recurring.export',
	},
	media: {
		create: 'media.create',
		update: 'media.update',
		delete: 'media.delete',
	},
	contacts: {
		create: 'contacts.create',
		update: 'contacts.update',
		delete: 'contacts.delete',
	},
	template: {
		create: 'template.create',
		update: 'template.update',
		delete: 'template.delete',
	},
	buttons: {
		read: 'buttons.read',
		export: 'buttons.export',
	},
};

export const CACHE_TIMEOUT = 60 * 60; //seconds
export const REFRESH_CACHE_TIMEOUT = 30 * 24 * 60 * 60; //seconds

export enum BROADCAST_STATUS {
	ACTIVE = 'ACTIVE',
	PAUSED = 'PAUSED',
}

export enum MESSAGE_STATUS {
	SENT = 'SENT',
	DELIVERED = 'DELIVERED',
	READ = 'READ',
	FAILED = 'FAILED',
	PENDING = 'PENDING',
	PROCESSING = 'PROCESSING',
	PAUSED = 'PAUSED',
}

export enum MESSAGE_SCHEDULER_TYPE {
	CAMPAIGN = 'CAMPAIGN',
	INDIVIDUAL = 'INDIVIDUAL',
}

export const DEFAULT_CATEGORIES = [
	'Accounting',
	'Banking',
	'Consulting',
	'Education',
	'Engineering',
	'Finance',
	'Healthcare',
	'Human Resources',
	'Information Technology',
	'Legal',
	'Marketing',
	'Media',
	'Non-profit',
	'Public Relations',
	'Real Estate',
	'Retail',
	'Sales',
	'Science',
	'Social Media',
	'Telecommunications',
	'Transportation',
	'Travel',
	'Other',
];
export enum TaskStatus {
	COMPLETED = 'completed',
	IN_PROGRESS = 'in_progress',
	PENDING = 'pending',
}
