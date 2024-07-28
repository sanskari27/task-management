import { InviteDialog } from '@/components/elements/invite_dialog';
import Loading from '@/components/elements/loading';
import { RemoveDialog } from '@/components/elements/remove_dialog';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Employees Details',
};

export default function EmployeesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense fallback={<Loading />}>
			{children}
			<InviteDialog />
			<RemoveDialog />
		</Suspense>
	);
}
