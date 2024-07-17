import Centered from '@/components/containers/centered';
import PageLayout from '@/components/containers/page-layout';
import OrganizationService from '@/services/organization';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
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
				<Link href={`/organizations/${params.org_id}`} className='inline-flex  items-center'>
					<ChevronLeft className='inline-block w-4 h-4 ' />
					Back to Organization
				</Link>
			</div>
			<Centered>
				<EditOrganizationForm id={params.org_id} details={details} />
			</Centered>
		</PageLayout>
	);
}
