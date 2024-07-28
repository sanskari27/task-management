import Centered from '@/components/containers/centered';
import PageLayout from '@/components/containers/page-layout';
import Loading from '@/components/elements/loading';
import { ManageCategoriesDialog } from '@/components/elements/manage_categories';
import OrganizationService from '@/services/organization.service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import EditOrganizationForm from './form';

export const metadata: Metadata = {
	title: 'Edit Organization Details',
};

export default async function EditOrganization({ params }: { params: { org_id: string } }) {
	const details = await OrganizationService.getOrganizationDetails(params.org_id);
	if (!details) {
		notFound();
	}

	return (
		<Suspense fallback={<Loading />}>
			<PageLayout>
				<div className='m-6'></div>
				<Centered>
					<EditOrganizationForm id={params.org_id} details={details} canEdit={details.is_owner} />
				</Centered>
				<ManageCategoriesDialog />
			</PageLayout>
		</Suspense>
	);
}
