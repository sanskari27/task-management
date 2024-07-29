import { IS_PRODUCTION } from '@/config/const';
import { ReminderDB } from '@/db';
import { sendEmail } from '@/provider/email';
import { sendWhatsapp, WhatsappTemplates } from '@/provider/whatsapp';
import { IDType } from '@/types';
import DateUtils from '@/utils/DateUtils';

type ReminderDetails = {
	task_id: IDType;
	reminderAt: Date;
	reminderType: 'whatsapp' | 'email';
	sentTo: string;
	whatsapp?: {
		template_name: string;
		variables: string[];
		link: string;
	};
	email?: {
		subject: string;
		body: string;
	};
};

export default class ReminderService {
	private constructor() {}

	static async createReminder(details: ReminderDetails) {
		if (DateUtils.getMomentNow().isAfter(details.reminderAt) || !details.sentTo) {
			return;
		}
		await ReminderDB.create({
			task: details.task_id,
			reminderAt: details.reminderAt,
			reminderType: details.reminderType,
			sentTo: details.sentTo,
			whatsapp: details.reminderType === 'whatsapp' ? details.whatsapp : undefined,
			email: details.reminderType === 'email' ? details.email : undefined,
		});
	}

	static async sendReminder() {
		if (!IS_PRODUCTION) {
			return;
		}
		const reminders = await ReminderDB.find({
			reminderAt: { $lte: DateUtils.getMomentNow().toDate() },
		});

		await ReminderDB.deleteMany({
			_id: { $in: reminders.map((reminder) => reminder._id) },
		});

		for (const reminder of reminders) {
			if (reminder.reminderType === 'email') {
				sendEmail(reminder.sentTo, {
					subject: reminder.email!.subject,
					html: reminder.email!.body,
				});
			} else if (reminder.reminderType === 'whatsapp') {
				sendWhatsapp(
					WhatsappTemplates.taskReminder({
						to: reminder.sentTo,
						bodyParams: reminder.whatsapp!.variables,
						link: reminder.whatsapp!.link,
					})
				);
			}
		}
	}

	static async sendOverview() {
		
	}
}
