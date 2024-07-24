export type Task = {
	id: string;
	title: string;
	category: string;
	priority: string;
	due_date: string;
	relative_date: string;
	status: 'pending' | 'completed' | 'in_progress';
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
};
