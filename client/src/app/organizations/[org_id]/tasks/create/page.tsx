'use client';

import Centered from '@/components/containers/centered';
import TaskDetailsForm from '@/components/elements/TaskDetailsForm';
import { taskDetailsSchema } from '@/schema/task';
import { useState } from 'react';
import { z } from 'zod';
import TasksLayout from './layout';

const defaultValues = {
	title: '',
	description: '',
	assigned_separately: false,
	assigned_to: [],
	category: '',
	priority: '',
	isRecurring: false,
	recurrence: {
		frequency: '',
		start_date: '',
		end_date: '',
		weekdays: [],
		monthdays: [],
	},
	due_date: '',
	links: [],
	files: [],
	voice_notes: [],
	remainders: [],
};

export default function CreateTasks() {
	const [isLoading, setLoading] = useState(false);

	async function handleSubmit(values: z.infer<typeof taskDetailsSchema>) {
		console.log(values);
		// setLoading(true);
		// const generated_id = await OrganizationService.updateOrganization(id, values);
		// if (!generated_id) {
		// 	toast.error('Failed to create organization');
		// 	setLoading(false);
		// 	return;
		// }
		// toast.success('Organization updated successfully');
		// router.push(`/organizations/${generated_id}`);
	}
	return (
		<TasksLayout>
			<Centered>
				<TaskDetailsForm
					defaultValues={defaultValues}
					isLoading={isLoading}
					onSubmit={handleSubmit}
				/>
			</Centered>
		</TasksLayout>
	);
}
