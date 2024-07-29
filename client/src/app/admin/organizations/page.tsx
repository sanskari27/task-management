import AdminService from '@/services/admin.service';
import { OrganizationTable } from './organization-table';

export default async function Organizations() {
	const details = await AdminService.listOrganizations();

	return (
		<section className='mx-[2%] md:mx-[7%] mt-3'>
			<div className='flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between'>
				<h2 className='text-3xl font-bold'>Organizations</h2>
			</div>
			<OrganizationTable data={details} />
		</section>
	);
}
