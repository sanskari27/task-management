import Loading from '@/components/elements/loading';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Restructure Organization Members',
};

export default function EmployeesLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
