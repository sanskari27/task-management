import { Document, Types } from 'mongoose';

export default interface IReminder extends Document {
	task: Types.ObjectId;
	reminderAt: Date;
	reminderType: 'email' | 'whatsapp';
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
}
