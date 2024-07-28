import PageLayout from '@/components/containers/page-layout';
import { EmployeesProvider } from '@/components/context/employees';
import { OrganizationDetailsProvider } from '@/components/context/organization-details';
import Navbar from '@/components/elements/Navbar';
import OrganizationService from '@/services/organization.service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
	title: 'Organization',
};

export default async function Layout({
	children,
	params: { org_id },
}: Readonly<{
	children: React.ReactNode;
	params: { org_id: string };
}>) {
	const details = await OrganizationService.getOrganizationDetails(org_id);
	const employees = await OrganizationService.employeeList(org_id);
	if (!details || !employees) {
		console.log('Organization not found');
		notFound();
	}

	return (
		<>
			<OrganizationDetailsProvider data={details}>
				<EmployeesProvider data={employees}>
					<Navbar org_id={org_id} />
					<PageLayout className='w-screen h-screen'>{children}</PageLayout>
				</EmployeesProvider>
			</OrganizationDetailsProvider>
		</>
	);
}
