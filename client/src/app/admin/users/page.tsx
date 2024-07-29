import AdminService from '@/services/admin.service';
import { notFound } from 'next/navigation';
import { UserTable } from './user-table';

export default async function UserPage() {
	const users = await AdminService.listUsers();

	if (!users) {
		notFound();
	}

	return (
		<section className='mx-[2%] md:mx-[7%] mt-3'>
			<div className='flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between'>
				<h2 className='text-3xl font-bold'>Users</h2>
			</div>
			<UserTable data={users} />
		</section>
	);
}
