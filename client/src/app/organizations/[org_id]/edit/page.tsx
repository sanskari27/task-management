import Centered from '@/components/containers/centered';
import PageLayout from '@/components/containers/page-layout';
import OrganizationService from '@/services/organization';
import { redirect } from 'next/navigation';
import EditOrganizationForm from './form';

export default async function EditOrganization({ params }: { params: { org_id: string } }) {
	const details = await OrganizationService.getOrganizationDetails(params.org_id);
	if (!details) {
		redirect('/organizations');
	}
	return (
		<PageLayout>
			<div className='m-6'>
			</div>
			<Centered>
				<EditOrganizationForm id={params.org_id} details={details} />
			</Centered>
		</PageLayout>
	);
}
