import OrganizationService from '@/services/organization.service';
import TasksService from '@/services/tasks.service';
import { redirect } from 'next/navigation';

export default async function Dashboard({ params }: { params: { org_id: string } }) {
	const details = await OrganizationService.getOrganizationDetails(params.org_id);
	if (!details) {
		redirect('/organizations');
	}

	const tasks = await TasksService.getAllTasks(params.org_id);
	console.log(tasks);
	return <>Dashboard</>;
}
