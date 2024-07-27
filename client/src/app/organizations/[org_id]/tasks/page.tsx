import SearchAndFilters, { DateFilters } from '@/components/elements/search-and-filters';
import DataGrid from '@/components/elements/task-data/data-grid';
import TasksService from '@/services/tasks.service';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'All Tasks',
};

export default async function Tasks({
	params: { org_id },
	searchParams,
}: {
	params: { org_id: string };
	searchParams: {
		search: string;
		frequency: string;
		priority: string;
		categories: string[];
		created_by: string[];
		assigned_to: string[];
	};
}) {
	console.log('org_id', org_id);

	const tasks = await TasksService.getAllTasks(org_id, searchParams);
	let notStarted = tasks.filter((task) => task.status === 'pending');
	let inProgress = tasks.filter((task) => task.status === 'in_progress');
	let completed = tasks.filter((task) => task.status === 'completed');
	console.log('task_pending', notStarted.length);

	return (
		<section className='mx-[5%] md:mx-[7%] mt-3'>
			<div className='flex flex-col md:flex-row  md:items-center md:justify-between gap-y-3'>
				<h2 className='text-3xl font-bold'>All Tasks</h2>
				<div className='min-w-[50%] '>
					<SearchAndFilters show_assigned_by={false} />
				</div>
			</div>
			<div className='mt-3'>
				<DateFilters />
			</div>

			<DataGrid
				organizationId={org_id}
				{...{
					notStarted,
					inProgress,
					completed,
				}}
			/>
		</section>
	);
}
