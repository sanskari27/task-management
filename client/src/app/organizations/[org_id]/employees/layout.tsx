import { InviteDialog } from '@/components/ui/invite_dialog';
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
		</>
	);
}
