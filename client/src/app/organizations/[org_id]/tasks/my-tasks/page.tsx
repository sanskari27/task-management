import SearchAndFilters from '@/components/elements/search-and-filters';
import TasksService from '@/services/tasks.service';

export default async function MyTasks({
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
	const tasks = await TasksService.getAssignedToMe(org_id, searchParams);
	// const tasks = await TasksService.getAllTasks(organizationId);

	return (
		<section className='mx-[5%] md:mx-[7%] mt-3'>
			<div className='flex flex-col md:flex-row  md:items-center md:justify-between gap-y-3'>
				<h2 className='text-3xl font-bold'>My Tasks</h2>
				<div className='min-w-[50%] '>
					<SearchAndFilters show_assigned_to={false} />
				</div>
			</div>

			{tasks.length}
		</section>
	);
}
