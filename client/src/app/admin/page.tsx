import AdminService from '@/services/admin.service';
import { notFound } from 'next/navigation';
import DailyTasksChart from './daily-tasks-chart';
import StatsTemplate from './stats-template';
import TasksChart from './tasks-chart';
export default async function AdminDashboard() {
	const details = await AdminService.overview();

	if (!details) {
		notFound();
	}

	return (
		<section className='mx-[2%] md:mx-[7%] mt-3 grid gap-4'>
			<div className='flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between'>
				<h2 className='text-3xl font-bold'>Dashboard</h2>
			</div>
			<div className='flex gap-4'>
				<div className='bg-white flex-1 py-4 rounded-lg'>
					<TasksChart tasks={details.tasks} />
				</div>
				<StatsTemplate
					items={[
						{
							title: 'Organizations',
							description: `${details.organizations}`,
							link: '/admin/organizations',
						},
						{
							title: 'Users',
							description: `${details.users}`,
							link: '/admin/users',
						},
						{
							title: 'Email Count',
							description: details.emailSent.toString(),
						},
						{
							title: 'Whatsapp count',
							description: details.whatsappSent.toString(),
						},
					]}
				/>
			</div>
			<div className='bg-white py-4 w-full rounded-lg'>
				<DailyTasksChart tasks={details.dailyTasks} />
			</div>
		</section>
	);
}
