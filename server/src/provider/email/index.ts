import { StorageDB } from '@/db';
import Logger from 'n23-logger';
import { Resend } from 'resend';
import { RESEND_API_KEY } from '../../config/const';
export { default as EmailTemplates } from './templates';

const resend = new Resend(RESEND_API_KEY);

export enum EmailSubjects {
	PasswordReset = 'Password reset request for Task @ Wautopilot',
	PasswordResetSuccess = 'Password reset successful for Task @ Wautopilot🥳',
	Welcome = 'Welcome to Task @ Wautopilot✌️',
	Signup = `Welcome to Task @ Wautopilot✌️`,
	TaskCreated = 'Assigned a new task on Task @ Wautopilot',
	TaskReminder = 'Reminder: Task @ Wautopilot',
	TaskUpdate = 'Added an update to Task @ Wautopilot',
}

export async function sendEmail(
	to: string,
	opts: {
		subject: string;
		html: string;
	}
) {
	Logger.debug(`Sending email to ${to} subject: ${opts.subject}`);

	const { error } = await resend.emails.send({
		from: 'Wautopilot <no-reply@wautopilot.com>',
		to: [to],
		subject: opts.subject,
		html: opts.html,
	});

	if (error) {
		Logger.error('Resend Error', error, { ...error, details: 'Error Sending email message' });
		return false;
	} else {
		StorageDB.incValue('email_sent', 1);
	}
	return true;
}
