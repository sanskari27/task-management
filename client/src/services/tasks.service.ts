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
}
