export default function PageLayout({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`flex items-center justify-center min-h-screen w-full bg-zinc-800 ${className}`}
		>
			{children}
		</div>
	);
}
