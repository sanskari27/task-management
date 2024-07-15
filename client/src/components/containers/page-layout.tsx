import { BackgroundBeams } from '../ui/background-beams';

export default function PageLayout({
	children,
	className = '',
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`flex flex-col ${className}`}>
			{children}
			<BackgroundBeams />
		</div>
	);
}
