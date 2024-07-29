import { AUTH_ERRORS, COMMON_ERRORS, CustomError } from '@/errors';
import TaskService from '@/services/task';
import DateGenerator from '@/utils/DateGenerator';
import { generateRandomID, Respond } from '@/utils/ExpressUtils';
import { NextFunction, Request, Response } from 'express';
import {
	AssignTaskType,
	CreateTaskType,
	FetchQueryType,
	TaskUpdateType,
	UpdateStatusType,
} from './tasks.validator';
export const JWT_EXPIRE_TIME = 3 * 60 * 1000;
export const SESSION_EXPIRE_TIME = 28 * 24 * 60 * 60 * 1000;

async function createTask(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	const data = req.locals.data as CreateTaskType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	const taskService = new TaskService(employeeService);

	if (!data.isRecurring) {
		if (data.assign_separately) {
			for (const assigned_to of data.assigned_to) {
				taskService.createTask({
					...data,
					assigned_to: [assigned_to],
				});
			}
			return Respond({
				res,
				status: 200,
			});
		} else {
			taskService.createTask(data);
		}
		return Respond({
			res,
			status: 200,
		});
	}

	const dateGenerator = new DateGenerator(data.recurrence!);
	const batch_id = generateRandomID();
	let sendNotification = true;
	while (dateGenerator.hasNext()) {
		const due_date = dateGenerator.next();
		if (data.assign_separately) {
			for (const assigned_to of data.assigned_to) {
				taskService.createTask({
					...data,
					assigned_to: [assigned_to],
					due_date,
					batch: {
						batch_task_id: batch_id,
						frequency: data.recurrence!.frequency,
						sendNotification,
					},
				});
			}
		} else {
			taskService.createTask({
				...data,
				due_date,
				batch: {
					batch_task_id: batch_id,
					frequency: data.recurrence!.frequency,
					sendNotification,
				},
			});
		}
		sendNotification = false;
	}

	return Respond({
		res,
		status: 200,
	});
}

async function transfer(req: Request, res: Response, next: NextFunction) {
	const { employeeService, id } = req.locals;
	const data = req.locals.data as AssignTaskType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}
	const taskService = new TaskService(employeeService);

	try {
		await taskService.transferTask({
			task_id: id,
			assigned_to: data.assigned_to,
		});
	} catch (e) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function getAssignedByMe(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	const query = req.locals.query as FetchQueryType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	const taskService = new TaskService(employeeService);

	const tasks = await taskService.getAssignedByMe(query);

	return Respond({
		res,
		status: 200,
		data: { tasks },
	});
}

async function getAssignedToMe(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	const query = req.locals.query as FetchQueryType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	const taskService = new TaskService(employeeService);

	const tasks = await taskService.getAssignedToMe(query);

	return Respond({
		res,
		status: 200,
		data: { tasks },
	});
}

async function getAssignedToAll(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	const query = req.locals.query as FetchQueryType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	const taskService = new TaskService(employeeService);

	const tasks = await taskService.assignedToEmployees(query);

	return Respond({
		res,
		status: 200,
		data: { tasks },
	});
}

async function updateStatus(req: Request, res: Response, next: NextFunction) {
	const { employeeService, id } = req.locals;
	const data = req.locals.data as UpdateStatusType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	const taskService = new TaskService(employeeService);

	try {
		await taskService.updateStatus(id, data.status);
	} catch (e) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function deleteTask(req: Request, res: Response, next: NextFunction) {
	const { employeeService } = req.locals;
	const task_id = req.params.id;

	if (!employeeService || !task_id) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	const taskService = new TaskService(employeeService);

	try {
		await taskService.markInactive(task_id);
	} catch (e) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function addTaskUpdate(req: Request, res: Response, next: NextFunction) {
	const { employeeService, id } = req.locals;
	const data = req.locals.data as TaskUpdateType;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	const taskService = new TaskService(employeeService);

	try {
		await taskService.addUpdate(id, data);
	} catch (e) {
		return next(new CustomError(AUTH_ERRORS.PERMISSION_DENIED));
	}

	return Respond({
		res,
		status: 200,
	});
}

async function taskDetails(req: Request, res: Response, next: NextFunction) {
	const { employeeService, id } = req.locals;

	if (!employeeService) {
		return next(new CustomError(COMMON_ERRORS.INVALID_HEADERS));
	}

	try {
		const taskService = new TaskService(employeeService);

		const task = await taskService.getDetails(id);

		return Respond({
			res,
			status: 200,
			data: { task },
		});
	} catch (e) {
		if (e instanceof CustomError) {
			return next(e);
		}
		return next(new CustomError(COMMON_ERRORS.INTERNAL_SERVER_ERROR, e));
	}
}

const Controller = {
	createTask,
	transfer,
	getAssignedByMe,
	getAssignedToMe,
	getAssignedToAll,
	updateStatus,
	deleteTask,
	addTaskUpdate,
	taskDetails,
};

export default Controller;
