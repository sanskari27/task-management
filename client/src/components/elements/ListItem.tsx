import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function ListItem({
	title,
	href,
	className = '',
}: {
	title: string;
	href: string;
	className?: String;
}) {
	return (
		<li
			className={cn('p-[0.5rem] dark:hover:bg-zinc-800 hover:bg-slate-100 rounded-lg ', className)}
		>
			<Link href={href}>
				<div>{title}</div>
			</Link>
		</li>
	);
}
