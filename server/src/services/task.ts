import { TaskStatus } from '@/config/const';
import { IEmployee, TaskDB } from '@/db';
import { EmployeeDB, TaskUpdateDB } from '@/db/repo';
import { COMMON_ERRORS, CustomError } from '@/errors';
import { EmailSubjects, EmailTemplates, sendEmail } from '@/provider/email';
import { sendWhatsapp, WhatsappTemplates } from '@/provider/whatsapp';
import { IDType } from '@/types';
import DateUtils from '@/utils/DateUtils';
import { filterUndefinedKeys, mongoArrayIncludes } from '@/utils/ExpressUtils';
import EmployeeService from './employee';
import ReminderService from './reminder';

type CreateTaskType = {
	assigned_to: IDType[];
	title: string;
	description: string;
	category: string;
	priority: 'low' | 'medium' | 'high';
	due_date?: Date;
	links: string[];
	files: string[];
	voice_notes: string[];
	reminders: {
		reminder_type: 'email' | 'whatsapp';
		before: number;
		before_type: 'minutes' | 'hours' | 'days';
	}[];
	batch?: {
		batch_task_id: string;
		frequency: 'daily' | 'weekly' | 'monthly';
	};
};

function processDocs(docs: any[]): {
	id: IDType;
	title: string;
	category: string;
	priority: 'low' | 'medium' | 'high';
	due_date: string;
	relative_date: string;
	isBatchTask: boolean;
	batch?: {
		frequency: 'daily' | 'weekly' | 'monthly';
		batch_task_id: string;
	};
	assigned_to: {
		id: string;
		name: string;
		email: string;
	}[];
	created_by: {
		id: string;
		name: string;
		email: string;
	};
	createdAt: string;
	status: string;
}[] {
	return docs.map((doc) => {
		return {
			id: doc._id as IDType,
			title: doc.title as string,
			category: doc.category as string,
			priority: doc.priority as 'low' | 'medium' | 'high',
			createdAt: DateUtils.getMoment(doc.createdAt).format('MMM Do, YYYY hh:mm A'),
			due_date: DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
			relative_date: DateUtils.getMoment(doc.due_date).fromNow(),
			isBatchTask: !!doc.batch as boolean,
			...(doc.batch && {
				batch: {
					frequency: doc.batch.frequency as 'daily' | 'weekly' | 'monthly',
					batch_task_id: doc.batch.batch_task_id as string,
				},
			}),
			assigned_to: doc.assigned_to.map((e: any) => {
				return {
					id: e.id as string,
					name: e.name as string,
					email: e.email as string,
				};
			}),
			created_by: {
				id: doc.created_by.id as string,
				name: doc.created_by.name as string,
				email: doc.created_by.email as string,
			},
			status: doc.status,
			isOverdue:
				doc.status === 'completed'
					? DateUtils.getMoment(doc.due_date).isBefore(doc.completed_at)
					: DateUtils.getMoment(doc.due_date).isBefore(DateUtils.getMomentNow()),
		};
	});
}

export default class TaskService {
	private _e_id: IDType;
	private _o_id: IDType;
	private _employeeService: EmployeeService;

	public constructor(service: EmployeeService) {
		this._e_id = service.employee_id;
		this._o_id = service.organization_id;
		this._employeeService = service;
	}

	public async createTask(data: CreateTaskType) {
		const doc = await TaskDB.create({
			...data,
			organization: this._o_id,
			created_by: this._e_id,
		});

		const created_by = await this._employeeService.getUserService();
		data.assigned_to.forEach(async (e_id) => {
			const userService = await (await EmployeeService.getServiceByID(e_id)).getUserService();
			const { name, email, phone } = userService.getDetails();
			sendEmail(email, {
				subject: `${created_by.getDetails().name} ${EmailSubjects.TaskCreated}`,
				html: EmailTemplates.taskCreated({
					name,
					title: doc.title,
					due_date: DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
					status: doc.status.toUpperCase().split('_').join(' '),
					priority: doc.priority.toUpperCase(),
					message: doc.description,
					task_link: `https://task.wautopilot.com/organizations/${this._o_id}/tasks/${doc._id}`,
				}),
			});

			sendWhatsapp(
				WhatsappTemplates.taskCreate({
					to: phone,
					bodyParams: [
						name,
						created_by.getDetails().name,
						doc.status[0].toUpperCase() + doc.status.slice(1),
						'Task Created',
						doc.category,
						doc.title,
						DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
						doc.priority.toUpperCase(),
					],
					link: `/${this._o_id}/tasks/${doc._id}`,
				})
			);

			data.reminders.map((reminder) => {
				ReminderService.createReminder({
					task_id: doc._id,
					reminderAt: DateUtils.getMoment(doc.due_date)
						.subtract(reminder.before, reminder.before_type)
						.toDate(),
					reminderType: reminder.reminder_type,
					sentTo: reminder.reminder_type === 'whatsapp' ? phone : email,
					...(reminder.reminder_type === 'whatsapp' && {
						whatsapp: {
							template_name: 'task_wautopilot_reminder',
							variables: [
								name,
								doc.description,
								doc.category,
								doc.title,
								DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
								doc.priority.toUpperCase(),
							],
							link: `/${this._o_id}/tasks/${doc._id}`,
						},
					}),
					...(reminder.reminder_type === 'email' && {
						email: {
							subject: EmailSubjects.TaskReminder,
							body: EmailTemplates.taskReminder({
								name,
								title: doc.title,
								due_date: DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
								status: doc.status.toUpperCase().split('_').join(' '),
								priority: doc.priority.toUpperCase(),
								message: doc.description,
								task_link: `https://task.wautopilot.com/organizations/${this._o_id}/tasks/${doc._id}`,
							}),
						},
					}),
				});
			});
		});

		return processDocs([doc])[0];
	}

	async getAssignedByMe(opts: {
		date_range?: {
			start: Date;
			end: Date;
		};
		assigned_to?: IDType[];
		categories?: string[];
		priority?: 'low' | 'medium' | 'high';
		frequency?: 'daily' | 'weekly' | 'monthly';
		status?: TaskStatus;
		search?: string;
	}) {
		opts = filterUndefinedKeys(opts);

		let docs = await TaskDB.aggregate([
			{
				$match: {
					$and: [
						{ organization: this._o_id },
						{ created_by: this._e_id },
						{
							...(opts.date_range && {
								due_date: {
									$gte: opts.date_range.start,
									$lte: opts.date_range.end,
								},
							}),
						},
						{ ...(opts.assigned_to && { assigned_to: { $in: opts.assigned_to } }) },
						{ ...(opts.categories && { category: { $in: opts.categories } }) },
						{ ...(opts.priority && { priority: opts.priority }) },
						{ ...(opts.frequency && { 'batch.frequency': opts.frequency }) },
						{ ...(opts.status && { status: opts.status }) },
						{
							...(opts.search && {
								$or: [
									{ title: { $regex: opts.search, $options: 'i' } },
									{ description: { $regex: opts.search, $options: 'i' } },
								],
							}),
						},
					],
				},
			},
			{
				$lookup: {
					from: EmployeeDB.collection.name,
					localField: 'assigned_to',
					foreignField: '_id',
					as: 'assigned_to',
				},
			},
			{
				$lookup: {
					from: EmployeeDB.collection.name,
					localField: 'created_by',
					foreignField: '_id',
					as: 'created_by',
				},
			},
			{
				$unwind: { path: '$created_by', preserveNullAndEmptyArrays: true },
			},
			{
				$project: {
					_id: 1,

					assigned_to: {
						$map: {
							input: '$assigned_to',
							as: 'assigned',
							in: {
								id: '$$assigned._id',
								name: '$$assigned.name',
								email: '$$assigned.email',
							},
						},
					},
					created_by: {
						id: '$created_by._id',
						name: '$created_by.name',
						email: '$created_by.email',
					},
					title: 1,
					category: 1,
					priority: 1,
					due_date: 1,
					batch: 1,
					status: 1,
					completed_at: 1,
					formattedDate: {
						$dateToString: { format: '%Y-%m-%d', date: '$due_date' },
					},
					priorityValue: {
						$switch: {
							branches: [
								{ case: { $eq: ['$priority', 'high'] }, then: 1 },
								{ case: { $eq: ['$priority', 'medium'] }, then: 2 },
								{ case: { $eq: ['$priority', 'low'] }, then: 3 },
							],
							default: 4, // Assign a default value for any unexpected priority values
						},
					},
				},
			},
		]);

		docs = docs.sort((a, b) => {
			const momentA = DateUtils.getMoment(a.due_date).startOf('day');
			const momentB = DateUtils.getMoment(b.due_date).startOf('day');

			if (momentA.isBefore(momentB)) {
				return -1;
			} else if (momentA.isAfter(momentB)) {
				return 1;
			}
			return a.priorityValue - b.priorityValue;
		});

		return processDocs(docs);
	}

	async getAssignedToMe(opts: {
		date_range?: {
			start: Date;
			end: Date;
		};
		created_by?: IDType[];
		categories?: string[];
		priority?: 'low' | 'medium' | 'high';
		frequency?: 'daily' | 'weekly' | 'monthly';
		status?: TaskStatus;
		search?: string;
	}) {
		opts = filterUndefinedKeys(opts);

		let docs = await TaskDB.aggregate([
			{
				$match: {
					$and: [
						{ organization: this._o_id },
						{ assigned_to: this._e_id },
						{
							...(opts.date_range && {
								due_date: {
									$gte: opts.date_range.start,
									$lte: opts.date_range.end,
								},
							}),
						},
						{ ...(opts.created_by && { assigned_to: { $in: opts.created_by } }) },
						{ ...(opts.categories && { category: { $in: opts.categories } }) },
						{ ...(opts.priority && { priority: opts.priority }) },
						{ ...(opts.frequency && { 'batch.frequency': opts.frequency }) },
						{ ...(opts.status && { status: opts.status }) },
						{
							...(opts.search && {
								$or: [
									{ title: { $regex: opts.search, $options: 'i' } },
									{ description: { $regex: opts.search, $options: 'i' } },
								],
							}),
						},
					],
				},
			},
			{
				$lookup: {
					from: EmployeeDB.collection.name,
					localField: 'assigned_to',
					foreignField: '_id',
					as: 'assigned_to',
				},
			},
			{
				$lookup: {
					from: EmployeeDB.collection.name,
					localField: 'created_by',
					foreignField: '_id',
					as: 'created_by',
				},
			},
			{
				$unwind: { path: '$created_by', preserveNullAndEmptyArrays: true },
			},
			{
				$project: {
					_id: 1,

					assigned_to: {
						$map: {
							input: '$assigned_to',
							as: 'assigned',
							in: {
								id: '$$assigned._id',
								name: '$$assigned.name',
								email: '$$assigned.email',
							},
						},
					},
					created_by: {
						id: '$created_by._id',
						name: '$created_by.name',
						email: '$created_by.email',
					},
					title: 1,
					category: 1,
					priority: 1,
					due_date: 1,
					batch: 1,
					status: 1,
					completed_at: 1,
					formattedDate: {
						$dateToString: { format: '%Y-%m-%d', date: '$due_date' },
					},
					priorityValue: {
						$switch: {
							branches: [
								{ case: { $eq: ['$priority', 'high'] }, then: 1 },
								{ case: { $eq: ['$priority', 'medium'] }, then: 2 },
								{ case: { $eq: ['$priority', 'low'] }, then: 3 },
							],
							default: 4, // Assign a default value for any unexpected priority values
						},
					},
				},
			},
		]);

		docs = docs.sort((a, b) => {
			const momentA = DateUtils.getMoment(a.due_date).startOf('day');
			const momentB = DateUtils.getMoment(b.due_date).startOf('day');

			if (momentA.isBefore(momentB)) {
				return -1;
			} else if (momentA.isAfter(momentB)) {
				return 1;
			}
			return a.priorityValue - b.priorityValue;
		});

		return processDocs(docs);
	}

	async assignedToEmployees(opts: {
		date_range?: {
			start: Date;
			end: Date;
		};
		created_by?: IDType[];
		assigned_to?: IDType[];
		categories?: string[];
		priority?: 'low' | 'medium' | 'high';
		frequency?: 'daily' | 'weekly' | 'monthly';
		status?: TaskStatus;
		search?: string;
	}) {
		let managedEmployees = await this._employeeService.managedEmployees();
		managedEmployees.push(this._e_id);

		opts = filterUndefinedKeys(opts);

		if (opts.assigned_to) {
			managedEmployees = managedEmployees.filter((emp) =>
				mongoArrayIncludes(opts.assigned_to!, emp)
			);
		}

		let docs = await TaskDB.aggregate([
			{
				$match: {
					$and: [
						{ organization: this._o_id },
						{ assigned_to: { $in: managedEmployees } },
						{
							...(opts.date_range && {
								due_date: {
									$gte: opts.date_range.start,
									$lte: opts.date_range.end,
								},
							}),
						},
						{ ...(opts.created_by && { assigned_to: { $in: opts.created_by } }) },
						{ ...(opts.categories && { category: { $in: opts.categories } }) },
						{ ...(opts.priority && { priority: opts.priority }) },
						{ ...(opts.frequency && { 'batch.frequency': opts.frequency }) },
						{ ...(opts.status && { status: opts.status }) },
						{
							...(opts.search && {
								$or: [
									{ title: { $regex: opts.search, $options: 'i' } },
									{ description: { $regex: opts.search, $options: 'i' } },
								],
							}),
						},
					],
				},
			},
			{
				$lookup: {
					from: EmployeeDB.collection.name,
					localField: 'assigned_to',
					foreignField: '_id',
					as: 'assigned_to',
				},
			},
			{
				$lookup: {
					from: EmployeeDB.collection.name,
					localField: 'created_by',
					foreignField: '_id',
					as: 'created_by',
				},
			},
			{
				$unwind: { path: '$created_by', preserveNullAndEmptyArrays: true },
			},
			{
				$project: {
					_id: 1,

					assigned_to: {
						$map: {
							input: '$assigned_to',
							as: 'assigned',
							in: {
								id: '$$assigned._id',
								name: '$$assigned.name',
								email: '$$assigned.email',
							},
						},
					},
					created_by: {
						id: '$created_by._id',
						name: '$created_by.name',
						email: '$created_by.email',
					},
					title: 1,
					category: 1,
					priority: 1,
					due_date: 1,
					batch: 1,
					status: 1,
					completed_at: 1,
					formattedDate: {
						$dateToString: { format: '%Y-%m-%d', date: '$due_date' },
					},
					priorityValue: {
						$switch: {
							branches: [
								{ case: { $eq: ['$priority', 'high'] }, then: 1 },
								{ case: { $eq: ['$priority', 'medium'] }, then: 2 },
								{ case: { $eq: ['$priority', 'low'] }, then: 3 },
							],
							default: 4, // Assign a default value for any unexpected priority values
						},
					},
				},
			},
		]);

		docs = docs.sort((a, b) => {
			const momentA = DateUtils.getMoment(a.due_date).startOf('day');
			const momentB = DateUtils.getMoment(b.due_date).startOf('day');

			if (momentA.isBefore(momentB)) {
				return -1;
			} else if (momentA.isAfter(momentB)) {
				return 1;
			}
			return a.priorityValue - b.priorityValue;
		});

		return processDocs(docs);
	}

	async transferTask(data: {
		task_id: IDType;
		assigned_to: IDType[];
		transfer_recursively?: boolean;
	}) {
		const managedEmployees = await this._employeeService.managedEmployees();
		managedEmployees.push(this._e_id);
		const { canManage, doc } = await this.canManageTask(data.task_id);

		if (!canManage) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		if (data.transfer_recursively && doc!.batch) {
			await TaskDB.updateMany(
				{
					$and: [
						{
							'batch.batch_task_id': doc!.batch.batch_task_id,
						},
						{ organization: this._o_id },
						{
							created_by: {
								$in: managedEmployees,
							},
						},
					],
				},
				{
					assigned_to: data.assigned_to,
				}
			);
		} else {
			doc!.assigned_to = data.assigned_to;
			await doc!.save();
		}
	}

	async updateStatus(task_id: IDType, status: TaskStatus) {
		const { canManage, doc } = await this.canManageTask(task_id);

		if (!canManage || !doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		if (doc!.status === status) {
			return;
		}

		const created_by = await this._employeeService.getUserService();
		doc.assigned_to.forEach(async (e_id) => {
			const userService = await (await EmployeeService.getServiceByID(e_id)).getUserService();
			const { name, email, phone } = userService.getDetails();

			sendEmail(email, {
				subject: `${created_by.getDetails().name} ${EmailSubjects.TaskCreated}`,
				html: EmailTemplates.taskUpdate({
					name,
					title: doc.title,
					due_date: DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
					status: doc.status.toUpperCase().split('_').join(' '),
					priority: doc.priority.toUpperCase(),
					message: '',
					task_link: `http://localhost:3000/organizations/${this._o_id}/tasks/${doc._id}`,
				}),
			});
			sendWhatsapp(
				WhatsappTemplates.taskUpdate({
					to: phone,
					bodyParams: [
						name,
						created_by.getDetails().name,
						status[0].toUpperCase() + status.slice(1),
						'Task Status Updated',
						doc.category,
						doc.title,
						DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
						doc.priority.toUpperCase(),
					],
					link: `/${this._o_id}/tasks/${doc._id}`,
				})
			);
		});

		doc!.status = status;
		await doc!.save();
	}

	async deleteTask(task_id: IDType) {
		const managedEmployees = await this._employeeService.managedEmployees();
		managedEmployees.push(this._e_id);

		await TaskDB.deleteOne({
			_id: task_id,
			organization: this._o_id,
			created_by: { $in: managedEmployees },
		});
	}

	async addUpdate(
		task_id: IDType,
		details: {
			message: string;
			links: string[];
			files: string[];
			voice_notes: string[];
			status: TaskStatus;
		}
	) {
		const { canManage, doc } = await this.canManageTask(task_id);

		if (!canManage || !doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await TaskUpdateDB.create({
			...details,
			task: task_id,
			added_by: this._e_id,
		});

		if (doc.status !== details.status) {
			doc.status = details.status;
			await doc!.save();
		}

		const created_by = await this._employeeService.getUserService();
		doc.assigned_to.forEach(async (e_id) => {
			const userService = await (await EmployeeService.getServiceByID(e_id)).getUserService();
			const { name, email, phone } = userService.getDetails();

			sendEmail(email, {
				subject: `${created_by.getDetails().name} ${EmailSubjects.TaskUpdate}`,
				html: EmailTemplates.taskUpdate({
					name,
					title: doc.title,
					due_date: DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
					status: doc.status.toUpperCase().split('_').join(' '),
					priority: doc.priority.toUpperCase(),
					message: details.message,
					task_link: `https://task.wautopilot.com/organizations/${this._o_id}/tasks/${doc._id}`,
				}),
			});
			sendWhatsapp(
				WhatsappTemplates.taskUpdate({
					to: phone,
					bodyParams: [
						name,
						created_by.getDetails().name,
						details.status[0].toUpperCase() + details.status.slice(1),
						details.message,
						doc.category,
						doc.title,
						DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
						doc.priority.toUpperCase(),
					],
					link: `/${this._o_id}/tasks/${doc._id}`,
				})
			);
		});
	}

	async getDetails(task_id: IDType) {
		const managedEmployees = await this._employeeService.managedEmployees();
		managedEmployees.push(this._e_id);

		const doc = await TaskDB.findOne({
			$and: [
				{ _id: task_id },
				{ organization: this._o_id },
				{
					$or: [
						{
							created_by: {
								$in: managedEmployees,
							},
						},
						{
							assigned_to: {
								$in: managedEmployees,
							},
						},
					],
				},
			],
		}).populate<{
			assigned_to: IEmployee[];
			created_by: IEmployee;
		}>('assigned_to created_by');

		if (!doc) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		const details = {
			id: doc._id,
			title: doc.title,
			description: doc.description,
			category: doc.category,
			priority: doc.priority,
			due_date: DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm A'),
			relative_date: DateUtils.getMoment(doc.due_date).fromNow(),
			links: doc.links,
			files: doc.files,
			voice_notes: doc.voice_notes,
			status: doc.status,
			isOverdue:
				doc.status === 'completed'
					? DateUtils.getMoment(doc.due_date).isBefore(doc.completed_at)
					: DateUtils.getMoment(doc.due_date).isBefore(DateUtils.getMomentNow()),
			assigned_to: doc.assigned_to.map((e: any) => {
				return {
					id: e._id,
					name: e.name,
					email: e.email,
				};
			}),
			created_by: {
				id: doc.created_by._id,
				name: doc.created_by.name,
				email: doc.created_by.email,
			},
			isBatchTask: !!doc.batch as boolean,
			...(doc.batch && {
				batch: {
					frequency: doc.batch.frequency as 'daily' | 'weekly' | 'monthly',
					batch_task_id: doc.batch.batch_task_id as string,
				},
			}),
		};

		const updatesDocs = await TaskUpdateDB.find({
			task: task_id,
		})
			.populate<{
				added_by: IEmployee;
			}>('added_by')
			.sort({ createdAt: -1 });

		const updates = updatesDocs.map((doc) => {
			return {
				id: doc._id,
				message: doc.message,
				links: doc.links,
				files: doc.files,
				voice_notes: doc.voice_notes,
				status: doc.status,
				added_by: {
					id: doc.added_by._id,
					name: doc.added_by.name,
					email: doc.added_by.email,
				},
			};
		});

		return {
			details,
			updates,
		};
	}

	async canManageTask(task_id: IDType) {
		const managedEmployees = await this._employeeService.managedEmployees();
		managedEmployees.push(this._e_id);

		const doc = await TaskDB.findOne({
			$and: [
				{ _id: task_id },
				{ organization: this._o_id },
				{
					$or: [
						{
							created_by: {
								$in: managedEmployees,
							},
						},
						{
							assigned_to: {
								$in: managedEmployees,
							},
						},
					],
				},
			],
		});

		return {
			canManage: !!doc,
			doc: doc,
		};
	}

	static async monthlyCreatedTasks() {
		const start = DateUtils.getMomentNow().subtract(12, 'months').startOf('month').toDate();
		const end = DateUtils.getMomentNow().endOf('month').toDate();

		const allMonths = [];
		let currentMonth = new Date(start);
		while (currentMonth <= end) {
			allMonths.push({
				month: currentMonth.getMonth() + 1, // Months are 0-indexed in JavaScript Date
				year: currentMonth.getFullYear(),
				count: 0,
			});
			currentMonth.setMonth(currentMonth.getMonth() + 1);
		}

		const docs = await TaskDB.aggregate([
			{
				$match: {
					createdAt: {
						$gte: start,
						$lte: end,
					},
				},
			},
			{
				$group: {
					_id: {
						month: { $month: '$createdAt' },
						year: { $year: '$createdAt' },
					},
					count: {
						$sum: 1,
					},
				},
			},
		]);

		// Convert docs to a map for easy lookup
		const docsMap = new Map(docs.map((doc) => [`${doc._id.year}-${doc._id.month}`, doc.count]));

		// Merge the results with all months
		const result = allMonths.map((month) => {
			const key = `${month.year}-${month.month}`;
			return {
				month: month.month,
				year: month.year,
				count: docsMap.get(key) || 0,
			};
		});
		return result;
	}

	static async dailyCreatedTasks() {
		const start = DateUtils.getMomentNow().startOf('month').toDate();
		const end = DateUtils.getMomentNow().endOf('month').toDate();

		const daysInMonth = DateUtils.getMomentNow().daysInMonth();

		const allDaysInMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);

		const docs = await TaskDB.aggregate([
			{
				$match: {
					sent_at: {
						$gte: start,
						$lte: end,
					},
				},
			},
			{
				$group: {
					_id: {
						$dayOfMonth: '$sent_at',
					},
					month: {
						$first: {
							$month: '$sent_at',
						},
					},
					count: {
						$sum: 1,
					},
				},
			},
		]);

		// Convert aggregation results into a map for easier lookup
		const docsMap = new Map(docs.map((doc) => [doc._id, doc.count]));

		// Create the final result array, ensuring each day is accounted for
		const result = allDaysInMonth.map((day) => ({
			day,
			month: DateUtils.getMomentNow().month() + 1, // Month is 0-indexed in Moment.js
			count: docsMap.get(day) || 0,
		}));

		return result;
	}
}
