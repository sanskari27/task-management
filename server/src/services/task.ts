import { TaskStatus } from '@/config/const';
import { IEmployee, TaskDB } from '@/db';
import { EmployeeDB, TaskUpdateDB } from '@/db/repo';
import { COMMON_ERRORS, CustomError } from '@/errors';
import { IDType } from '@/types';
import DateUtils from '@/utils/DateUtils';
import { filterUndefinedKeys, mongoArrayIncludes } from '@/utils/ExpressUtils';
import EmployeeService from './employee';

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
			createdAt: DateUtils.getMoment(doc.createdAt).format('MMM Do, YYYY hh:mm a'),
			due_date: DateUtils.getMoment(doc.due_date).format('MMM Do, YYYY hh:mm a'),
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

		return processDocs([doc])[0];
	}

	async getAssignedByMe(opts: {
		date_range?: {
			start: Date;
			end: Date;
		};
		assigned_to?: IDType[];
		category?: string;
		priority?: 'low' | 'medium' | 'high';
		frequency?: 'daily' | 'weekly' | 'monthly';
		status?: TaskStatus;
	}) {
		opts = filterUndefinedKeys(opts);

		const docs = await TaskDB.aggregate([
			{
				$match: {
					organization: this._o_id,
					created_by: this._e_id,
					...(opts.date_range && {
						due_date: {
							$gte: opts.date_range.start,
							$lte: opts.date_range.end,
						},
					}),
					...(opts.assigned_to && { assigned_to: { $in: opts.assigned_to } }),
					...(opts.category && { category: opts.category }),
					...(opts.priority && { priority: opts.priority }),
					...(opts.frequency && { 'batch.frequency': opts.frequency }),
					...(opts.status && { status: opts.status }),
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
				$sort: {
					due_date: 1,
				},
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
				},
			},
		]);

		return processDocs(docs);
	}

	async getAssignedToMe(opts: {
		date_range?: {
			start: Date;
			end: Date;
		};
		created_by?: IDType[];
		category?: string;
		priority?: 'low' | 'medium' | 'high';
		frequency?: 'daily' | 'weekly' | 'monthly';
		status?: TaskStatus;
	}) {
		opts = filterUndefinedKeys(opts);

		const docs = await TaskDB.aggregate([
			{
				$match: {
					organization: this._o_id,
					assigned_to: this._e_id,
					...(opts.date_range && {
						due_date: {
							$gte: opts.date_range.start,
							$lte: opts.date_range.end,
						},
					}),
					...(opts.created_by && { created_by: { $in: opts.created_by } }),
					...(opts.category && { category: opts.category }),
					...(opts.priority && { priority: opts.priority }),
					...(opts.frequency && { 'batch.frequency': opts.frequency }),
					...(opts.status && { status: opts.status }),
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
				$sort: {
					due_date: 1,
				},
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
				},
			},
		]);

		return processDocs(docs);
	}

	async assignedToEmployees(opts: {
		date_range?: {
			start: Date;
			end: Date;
		};
		created_by?: IDType[];
		assigned_to?: IDType[];
		category?: string;
		priority?: 'low' | 'medium' | 'high';
		frequency?: 'daily' | 'weekly' | 'monthly';
		status?: TaskStatus;
	}) {
		let managedEmployees = await this._employeeService.managedEmployees();
		managedEmployees.push(this._e_id);

		opts = filterUndefinedKeys(opts);

		if (opts.assigned_to) {
			managedEmployees = managedEmployees.filter((emp) =>
				mongoArrayIncludes(opts.assigned_to!, emp)
			);
		}

		const docs = await TaskDB.aggregate([
			{
				$match: {
					organization: this._o_id,
					assigned_to: { $in: managedEmployees },
					...(opts.date_range && {
						due_date: {
							$gte: opts.date_range.start,
							$lte: opts.date_range.end,
						},
					}),
					...(opts.created_by && { created_by: { $in: opts.created_by } }),
					...(opts.category && { category: opts.category }),
					...(opts.priority && { priority: opts.priority }),
					...(opts.frequency && { 'batch.frequency': opts.frequency }),
					...(opts.status && { status: opts.status }),
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
				$sort: {
					due_date: 1,
				},
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
				},
			},
		]);

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

		if (!canManage) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}
		if (doc!.status === status) {
			return;
		}

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
			status: string;
		}
	) {
		const { canManage } = await this.canManageTask(task_id);

		if (!canManage) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		await TaskUpdateDB.create({
			...details,
			task: task_id,
			added_by: this._e_id,
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
			due_date: doc.due_date,
			links: doc.links,
			files: doc.files,
			voice_notes: doc.voice_notes,
			status: doc.status,
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
		};

		const updatesDocs = await TaskUpdateDB.find({
			task: task_id,
		}).populate<{
			added_by: IEmployee;
		}>('added_by');

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
}
