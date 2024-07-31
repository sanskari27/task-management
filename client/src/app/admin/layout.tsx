import PageLayout from '@/components/containers/page-layout';
import Loading from '@/components/elements/loading';
import Navbar from '@/components/elements/Navbar';
import { SendOrganizationCode } from '@/components/elements/sendOrganizationCode';
import { BackgroundBeams } from '@/components/ui/background-beams';
import AuthService from '@/services/auth.service';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Organizations',
};

export default async function OrganizationsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { isAdmin } = await AuthService.isUserAuthenticated();
	return (
		<Suspense fallback={<Loading />}>
			<PageLayout>
				<Navbar isAdmin={isAdmin} />
				{children}
				<SendOrganizationCode />
				<BackgroundBeams />
			</PageLayout>
		</Suspense>
	);
}
