import Loading from '@/components/elements/loading';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Organizations',
};

export default async function OrganizationsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
