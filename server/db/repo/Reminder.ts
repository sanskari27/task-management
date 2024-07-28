import mongoose from 'mongoose';
import IReminder from '../types/reminder';
import { TaskDB_name } from './Task';

export const ReminderDB_name = 'Reminder';

const schema = new mongoose.Schema<IReminder>({
	task: {
		type: mongoose.Schema.Types.ObjectId,
		ref: TaskDB_name,
	},
	reminderAt: {
		type: Date,
		required: true,
	},
	reminderType: {
		type: String,
		enum: ['email', 'whatsapp'],
		required: true,
	},
	sentTo: {
		type: String,
		required: true,
	},
	whatsapp: {
		template_name: String,
		variables: [String],
		link: String,
	},
	email: {
		subject: String,
		body: String,
	},
});

const ReminderDB = mongoose.model<IReminder>(ReminderDB_name, schema);

export default ReminderDB;
