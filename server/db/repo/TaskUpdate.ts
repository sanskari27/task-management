import mongoose from 'mongoose';
import ITaskUpdate from '../types/taskupdate';
import { EmployeeDB_name } from './Employee';
import { TaskDB_name } from './Task';

export const TaskUpdateDB_name = 'TaskUpdate';

const schema = new mongoose.Schema<ITaskUpdate>(
	{
		task: {
			type: mongoose.Schema.Types.ObjectId,
			ref: TaskDB_name,
			required: true,
		},
		added_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: EmployeeDB_name,
			required: true,
		},
		message: {
			type: String,
		},
		links: {
			type: [String],
			default: [],
		},
		files: {
			type: [String],
			default: [],
		},
		voice_notes: {
			type: [String],
			default: [],
		},
		status: String,
	},
	{
		timestamps: { createdAt: true, updatedAt: false },
	}
);

const TaskUpdateDB = mongoose.model<ITaskUpdate>(TaskUpdateDB_name, schema);

export default TaskUpdateDB;
