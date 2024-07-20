import { InviteDialog } from '@/components/elements/invite_dialog';
import { RemoveDialog } from '@/components/elements/remove_dialog';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Employees Details',
};

export default function EmployeesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{children}
			<InviteDialog />
			<RemoveDialog />
		</>
	);
}
