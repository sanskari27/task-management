import api from '@/lib/api';

export default class TasksService {
	static async getAllTasks(organizationId: string) {
		//adding header to the api call
		try {
			const { data } = await api.get(`/tasks`, {
				headers: {
					'X-Organization-ID': organizationId,
				},
			});
			return (data.tasks ?? []).map((task: any) => {
				return {
					id: (task.id as string) ?? '',
					title: (task.title as string) ?? '',
					category: (task.category as string) ?? '',
					priority: (task.priority as string) ?? '',
					due_date: (task.due_date as string) ?? '',
					isBatchTask: (task.isBatchTask as boolean) ?? false,
					assigned_to: (task.assigned_to ?? []).map((assigned: any) => {
						return {
							id: (assigned.id as string) ?? '',
							name: (assigned.name as string) ?? '',
							email: (assigned.email as string) ?? '',
						};
					}),
					created_by: {
						id: (task?.created_by.id as string) ?? '',
						name: (task?.created_by.name as string) ?? '',
						email: (task?.created_by.email as string) ?? '',
					},
				};
			});
		} catch (error) {
			return null;
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
			return (data.tasks ?? []).map((task: any) => {
				return {
					id: (task.id as string) ?? '',
					title: (task.title as string) ?? '',
					category: (task.category as string) ?? '',
					priority: (task.priority as string) ?? '',
					due_date: (task.due_date as string) ?? '',
					isBatchTask: (task.isBatchTask as boolean) ?? false,
					assigned_to: (task.assigned_to ?? []).map((assigned: any) => {
						return {
							id: (assigned.id as string) ?? '',
							name: (assigned.name as string) ?? '',
							email: (assigned.email as string) ?? '',
						};
					}),
					created_by: {
						id: (task?.created_by.id as string) ?? '',
						name: (task?.created_by.name as string) ?? '',
						email: (task?.created_by.email as string) ?? '',
					},
				};
			}) as {
				id: string;
				title: string;
				category: string;
				priority: string;
				due_date: string;
				isBatchTask: boolean;
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
			}[];
		} catch (error) {
			return [];
		}
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
