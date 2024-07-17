import PageLayout from '@/components/containers/page-layout';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Organization',
};

export default function Layout({
	children,
	params: { org_id },
}: Readonly<{
	children: React.ReactNode;
	params: { org_id: string };
}>) {
	return (
		<PageLayout className='w-screen h-screen'>
			{children}
			<BackgroundBeams />
		</PageLayout>
	);
}
