'use client';

import Centered from '@/components/containers/centered';
import TaskDetailsForm from '@/components/elements/TaskDetailsForm';
import { taskDetailsSchema } from '@/schema/task';
import OrganizationService from '@/services/organization.service';
import { redirect } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import TasksLayout from './layout';

const defaultValues = {
	title: '',
	description: '',
	assigned_separately: false,
	assigned_to: [],
	category: '',
	priority: 'low',
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

export default function CreateTasks({ params }: { params: { org_id: string } }) {
	const [isLoading, setLoading] = useState(false);
	const [employees, setEmployees] = useState([]);
	const [details, setDetails] = useState<{
		id: any;
		name: any;
		domain: any;
		industry: any;
		logo: any;
		timezone: any;
		address: {
			street: any;
			city: any;
			state: any;
			country: any;
			zip: any;
			_id: any;
		};
		categories: any;
	}>();

	const getEmployees = useCallback(async () => {
		const employees = await OrganizationService.employeeList(params.org_id);
		setEmployees(employees);
	}, [params.org_id]);

	const getOrganizationDetails = useCallback(async () => {
		const details = await OrganizationService.getOrganizationDetails(params.org_id);
		if (!details) {
			redirect('/organizations');
		}
		setDetails(details);
	}, [params.org_id]);

	useEffect(() => {
		getOrganizationDetails();
		getEmployees();
	}, [getEmployees, getOrganizationDetails]);

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
					categories={details?.categories}
					employees={employees}
					defaultValues={defaultValues}
					isLoading={isLoading}
					onSubmit={handleSubmit}
				/>
			</Centered>
		</TasksLayout>
	);
}
