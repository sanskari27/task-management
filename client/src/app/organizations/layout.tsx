import PageLayout from '@/components/containers/page-layout';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Organizations',
};

export default function OrganizationsLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<PageLayout>
				{children}
				<BackgroundBeams />
			</PageLayout>
		</>
	);
}
