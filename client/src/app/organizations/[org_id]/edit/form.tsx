'use client';
import OrganizationDetailsForm from '@/components/elements/OrganizationDetailsForm';
import { organizationDetailsSchema } from '@/schema/organization';
import OrganizationService from '@/services/organization';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

export default function EditOrganizationForm({
	id,
	details,
}: {
	id: string;
	details: z.infer<typeof organizationDetailsSchema>;
}) {
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(values: z.infer<typeof organizationDetailsSchema>) {
		setLoading(true);
		const generated_id = await OrganizationService.updateOrganization(id, values);
		if (!generated_id) {
			toast.error('Failed to create organization');
			setLoading(false);
			return;
		}
		toast.success('Organization updated successfully');
		router.push(`/organizations/${generated_id}`);
	}

	return (
		<OrganizationDetailsForm
			defaultValues={details}
			onSubmit={handleSubmit}
			isLoading={isLoading}
		/>
	);
}
