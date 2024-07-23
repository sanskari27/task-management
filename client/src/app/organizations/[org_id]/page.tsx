import { redirect } from 'next/navigation';

export default function Dashboard({ params }: { params: { org_id: string } }) {
	redirect(`/organizations/${params.org_id}/tasks/my-tasks`);
}
