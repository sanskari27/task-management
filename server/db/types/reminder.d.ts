import { Document, Types } from 'mongoose';

export default interface IReminder extends Document {
	task: Types.ObjectId;
	reminderAt: Date;
	reminderType: 'email' | 'whatsapp';
	sentTo: Types.ObjectId[];
	whatsapp: {
		template_id: string;
		template_name: string;
		variables: string[];
        link: string;
	};
	email: {
		subject: string;
		body: string;
	};
}
 