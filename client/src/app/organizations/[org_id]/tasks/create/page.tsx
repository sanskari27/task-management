'use client';

import Centered from '@/components/containers/centered';
import { useEmployees } from '@/components/context/employees';
import { useOrganizationDetails } from '@/components/context/organization-details';
import TaskDetailsForm from '@/components/elements/TaskDetailsForm';
import { taskDetailsSchema } from '@/schema/task';
import { useState } from 'react';
import { z } from 'zod';

const defaultValues = {
	title: '',
	description: '',
	assigned_separately: false,
	assigned_to: [],
	category: '',
	priority: 'low',
	isRecurring: false,
	recurrence: {
		frequency: 'daily',
		start_date: new Date(),
		end_date: new Date(new Date().setDate(new Date().getDate() + 365)),
		weekdays: [],
		monthdays: [],
	},
	due_date: new Date(),
	links: [],
	files: [],
	voice_notes: [],
	remainders: [],
};

export default function CreateTasks({ params }: { params: { org_id: string } }) {
	const [isLoading, setLoading] = useState(false);
	const employees = useEmployees();
	const { categories } = useOrganizationDetails();

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
		<Centered>
			<TaskDetailsForm
				categories={categories}
				employees={employees}
				defaultValues={defaultValues}
				isLoading={isLoading}
				onSubmit={handleSubmit}
			/>
		</Centered>
	);
}
