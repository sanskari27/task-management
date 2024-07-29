import PageLayout from '@/components/containers/page-layout';
import AdminService from '@/services/admin.service';

export default async function UserPage() {
	const users = await AdminService.listUsers();

	console.log(users);
	return <PageLayout>hello</PageLayout>;
}
