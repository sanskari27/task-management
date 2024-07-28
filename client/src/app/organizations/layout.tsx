import PageLayout from '@/components/containers/page-layout';
import Loading from '@/components/elements/loading';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Organizations',
};

export default function OrganizationsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense fallback={<Loading />}>
			<PageLayout>
				{children}
				<BackgroundBeams />
			</PageLayout>
		</Suspense>
	);
}
