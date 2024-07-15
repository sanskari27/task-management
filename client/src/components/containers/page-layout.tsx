import { BackgroundBeams } from '../ui/background-beams';

export default function PageLayout({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`flex h-screen w-screen items-center justify-center ${className}`}>
			{children}
			<BackgroundBeams />
		</div>
	);
}
