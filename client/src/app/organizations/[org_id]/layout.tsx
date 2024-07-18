import PageLayout from '@/components/containers/page-layout';
import Navbar from '@/components/elements/Navbar';
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
		<>
			<Navbar params={org_id} />
			<PageLayout className='w-screen h-screen'>{children}</PageLayout>
		</>
	);
}
