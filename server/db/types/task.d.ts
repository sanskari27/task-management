import { TaskStatus } from '@/config/const';
import { Document, Types } from 'mongoose';

export default interface ITask extends Document {
	_id: Types.ObjectId;
	organization: Types.ObjectId;
	assigned_to: Types.ObjectId[];
	created_by: Types.ObjectId;

	title: string;
	description: string;
	category: string;
	priority: 'low' | 'medium' | 'high';
	due_date?: Date;
	links: string[];
	files: string[];
	voice_notes: string[];
	remainders: {
		remainder_type: 'email' | 'whatsapp';
		before: number;
		before_type: 'minutes' | 'hours' | 'days';
	}[];
	batch?: {
		batch_task_id: string;
		frequency: 'daily' | 'weekly' | 'monthly';
	};
	status: TaskStatus;
	completed_at?: Date;
}
