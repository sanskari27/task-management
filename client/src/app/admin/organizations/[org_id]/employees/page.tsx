import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { EmployeeDataTable } from './table';

export const metadata: Metadata = {
	title: 'Members @ Organization',
};

export default async function EmployeesPage({ params }: { params: { org_id: string } }) {
	return (
		<section className='mx-[2%] md:mx-[7%] mt-3'>
			<div className='flex flex-col md:flex-row gap-2 md:gap-0 md:justify-between'>
				<h2 className='text-3xl font-bold'>Employees</h2>
				<div className='flex flex-col md:flex-row md:justify-between gap-3'>
					<Link
						href={`/organizations/${params.org_id}/employees?invite=true`}
						className='border  border-gray-500 pt-2 pb-1 px-4 rounded-md bg-transparent dark:bg-white text-black  font-medium text-sm'
					>
						<span className='gap-2 inline-flex items-center'>
							<Plus className='h-5 w-5' />
							Add Employee
						</span>
					</Link>
					<Link
						href={`/organizations/${params.org_id}/employees/tree`}
						className='border border-gray-500 dark:border-gray-300 pt-2 pb-2 md:pb-1 px-4 rounded-md bg-transparent dark:text-white text-black  font-medium text-sm'
					>
						<span className='gap-2 inline-flex items-center'>View Org Tree</span>
					</Link>
				</div>
			</div>
			<EmployeeDataTable />
		</section>
	);
}
