import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Tasks',
};

export default async function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
