import OrganizationService from '@/services/organization';

export default async function OrganizationDetails({ params }: { params: { org_id: string } }) {
	if (params.org_id === '') {
		return <div>Create new organization</div>;
	}
	const details = await OrganizationService.getOrganizationDetails(params.org_id);
	console.log(details);
}
