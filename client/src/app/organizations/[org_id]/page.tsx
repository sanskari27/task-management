import OrganizationService from '@/services/organization';
import { redirect } from 'next/navigation';

export default async function Dashboard({ params }: { params: { org_id: string } }) {
	const details = await OrganizationService.getOrganizationDetails(params.org_id);
	if (!details) {
		redirect('/organizations');
	}
	return <>Dashboard</>;
}
