import { TaskStatus } from '@/config/const';
import DateUtils from '@/utils/DateUtils';
import mongoose from 'mongoose';
import ITask from '../types/task';
import { EmployeeDB_name } from './Employee';
import { OrganizationDB_name } from './Organization';

export const TaskDB_name = 'Task';

const schema = new mongoose.Schema<ITask>(
	{
		organization: {
			type: mongoose.Schema.Types.ObjectId,
			ref: OrganizationDB_name,
			required: true,
		},
		assigned_to: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: EmployeeDB_name,
			},
		],
		created_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: EmployeeDB_name,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: String,
		category: {
			type: String,
			required: true,
		},
		priority: {
			type: String,
			enum: ['low', 'medium', 'high'],
			default: 'medium',
		},
		due_date: {
			type: Date,
			default: undefined,
		},
		links: [String],
		files: [String],
		voice_notes: [String],
		reminders: [
			{
				reminder_type: {
					type: String,
					enum: ['email', 'whatsapp'],
				},
				before: Number,
				before_type: {
					type: String,
					enum: ['minutes', 'hours', 'days'],
				},
			},
		],
		batch: {
			type: {
				batch_task_id: String,
				frequency: {
					type: String,
					enum: ['daily', 'weekly', 'monthly'],
				},
			},
			default: undefined,
		},
		status: {
			type: String,
			enum: Object.values(TaskStatus),
			default: TaskStatus.PENDING,
		},
		completed_at: {
			type: Date,
			default: undefined,
		},
		inActive: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: { createdAt: true, updatedAt: false },
	}
);

schema.pre('save', function (next) {
	if (this.isModified('status') && this.status === TaskStatus.COMPLETED) {
		this.completed_at = DateUtils.getMomentNow().toDate();
	}
	next();
});

schema.pre('updateOne', function (next) {
	const update = this.getUpdate() as any;
	if (update) {
		if (update.status === TaskStatus.COMPLETED) {
			update.completed_at = DateUtils.getMomentNow().toDate();
		} else if (update.$set && update.$set.status === TaskStatus.COMPLETED) {
			update.$set.completed_at = DateUtils.getMomentNow().toDate();
		}
	}
	next();
});

schema.pre('updateMany', function (next) {
	const update = this.getUpdate() as any;
	if (update) {
		if (update.status === TaskStatus.COMPLETED) {
			update.completed_at = DateUtils.getMomentNow().toDate();
		} else if (update.$set && update.$set.status === TaskStatus.COMPLETED) {
			update.$set.completed_at = DateUtils.getMomentNow().toDate();
		}
	}
	next();
});

const TaskDB = mongoose.model<ITask>(TaskDB_name, schema);

export default TaskDB;
