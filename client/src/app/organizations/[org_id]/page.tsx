import { redirect } from 'next/navigation';

export default function Dashboard({ params }: { params: { org_id: string } }) {
	const now = new Date();
	const start_date = new Date(now);
	const end_date = new Date(now);
	start_date.setHours(0, 0, 0, 0);
	end_date.setHours(23, 59, 59, 999);
	redirect(
		`/organizations/${
			params.org_id
		}/tasks/my-tasks?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`
	);
}
