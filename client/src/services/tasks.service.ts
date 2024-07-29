import api from '@/lib/api';
import { Task } from '@/types/task';

export default class TasksService {
	static async getAllTasks(organizationId: string, query: any) {
		//adding header to the api call
		try {
			const { data } = await api.get(`/tasks`, {
				headers: {
					'X-Organization-ID': organizationId,
				},
				params: query,
			});
			return (data.tasks ?? []) as Task[];
		} catch (error) {
			return [];
		}
	}

	static async getAssignedToMe(organizationId: string, query: any) {
		//adding header to the api call
		try {
			const { data } = await api.get(`/tasks/assigned-to-me`, {
				headers: {
					'X-Organization-ID': organizationId,
				},
				params: query,
			});
			return (data.tasks ?? []) as Task[];
		} catch (error) {
			return [];
		}
	}

	static async getAssignedByMe(organizationId: string, query: any) {
		//adding header to the api call
		try {
			const { data } = await api.get(`/tasks/assigned-by-me`, {
				headers: {
					'X-Organization-ID': organizationId,
				},
				params: query,
			});
			return (data.tasks ?? []) as Task[];
		} catch (error) {
			return [];
		}
	}

	static async updateStatus(
		organizationId: string,
		{
			taskId,
			status,
		}: {
			taskId: string;
			status: string;
		}
	) {
		await api.post(
			`/tasks/${taskId}/update-status`,
			{ status },
			{
				headers: {
					'X-Organization-ID': organizationId,
				},
			}
		);
	}

	static async createTask(
		organizationId: string,
		task: {
			title: string;
			description: string;
			assign_separately: boolean;
			assigned_to: string[];
			category: string;
			priority: string;
			isRecurring: boolean;
			due_date: Date;
			recurrence: {
				frequency: string;
				start_date: Date;
				end_date: Date;
				weekdays: string[];
				monthdays: string[];
			};
			reminders: {
				reminder_type: string;
				before: number;
				before_type: string;
			}[];
			links: string[];
			files: string[];
			voice_notes: string[];
		}
	) {
		await api.post(`/tasks`, task, {
			headers: {
				'X-Organization-ID': organizationId,
			},
		});
	}

	static async getTaskDetails(org_id: string, task_id: string) {
		try {
			const { data } = await api.get(`/tasks/${task_id}`, {
				headers: {
					'X-Organization-ID': org_id,
				},
			});
			return data.task as {
				details: {
					id: string;
					title: string;
					description: string;
					category: string;
					priority: 'low' | 'medium' | 'high';
					due_date: string;
					relative_date: string;
					links: string[];
					files: string[];
					voice_notes: string[];
					isOverdue: boolean;
					isBatchTask: boolean;
					batch?: {
						batch_task_id: string;
						frequency: 'daily' | 'weekly' | 'monthly';
					};
					status: 'pending' | 'completed' | 'in_progress';
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
				};
				updates: {
					id: string;
					message: string;
					links: string[];
					files: string[];
					voice_notes: string[];
					status: string;
					added_by: {
						id: string;
						name: string;
						email: string;
					};
				}[];
			};
		} catch (error) {
			return null;
		}
	}

	static async addUpdate(
		org_id: string,
		details: {
			files: string[];
			message: string;
			links: string[];
			voice_notes: string[];
			taskId: string;
		}
	) {
		await api.post(`/tasks/${details.taskId}/add-update`, details, {
			headers: {
				'X-Organization-ID': org_id,
			},
		});
	}

	static async markInactive(org_id: string, taskId: string) {
		await api.delete(`/tasks/${taskId}`, {
			headers: {
				'X-Organization-ID': org_id,
			},
		});
	}
}
