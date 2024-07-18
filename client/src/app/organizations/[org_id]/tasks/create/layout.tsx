import PageLayout from '@/components/containers/page-layout';

export default function TasksLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<PageLayout>{children}</PageLayout>
		</>
	);
}
