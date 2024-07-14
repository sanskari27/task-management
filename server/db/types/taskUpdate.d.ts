import { Document, Types } from 'mongoose';

export default interface ITaskUpdate extends Document {
	_id: Types.ObjectId;
	task: Types.ObjectId;

	added_by: Types.ObjectId;

	message: string;
	links: string[];
	files: string[];
	voice_notes: string[];
	status: string;

	createdAt: Date;
}
