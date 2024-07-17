export default function Centered({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`flex flex-col items-center justify-center h-full w-full ${className} `}>
			{children}
		</div>
	);
}
