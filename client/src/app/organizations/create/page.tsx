'use client';
import Centered from '@/components/containers/centered';
import PageLayout from '@/components/containers/page-layout';
import { organizationDetailsSchema } from '@/schema/organization';
import OrganizationService from '@/services/organization';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import OrganizationDetailsForm from '../../../components/elements/OrganizationDetailsForm';

const defaultValues = {
	name: '',
	industry: '',
	domain: '',
	logo: '',
	address: {
		street: '',
		city: '',
		state: '',
		zip: '',
		country: '',
	},
	timezone: '',
};

export default function CreateOrganization() {
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(values: z.infer<typeof organizationDetailsSchema>) {
		setLoading(true);
		const id = await OrganizationService.createOrganization(values);
		if (!id) {
			toast.error('Failed to create organization');
			setLoading(false);
			return;
		}
		toast.success('Organization created successfully');
		router.push(`/organizations/${id}`);
	}

	return (
		<PageLayout>
			<div className='m-6'>
				<Link href='/organizations' className='inline-flex  items-center'>
					<ChevronLeft className='inline-block w-4 h-4 ' />
					Back to Organizations
				</Link>
			</div>
			<Centered>
				<OrganizationDetailsForm
					defaultValues={defaultValues}
					onSubmit={handleSubmit}
					isLoading={isLoading}
				/>
			</Centered>
		</PageLayout>
	);
}
