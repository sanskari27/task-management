import Link from 'next/link';

export default function ListItem({
	title,
	description,
	href,
}: {
	title: string;
	description: string;
	href: string;
}) {
	return (
		<li className='p-[0.5rem] dark:hover:bg-zinc-800 hover:bg-slate-100 rounded-lg'>
			<Link href={href}>
				<div>{title}</div>
				<div className='text-sm dark:text-zinc-400 text-zinc-600 whitespace-pre-wrap line-clamp-2'>
					{description}
				</div>
			</Link>
		</li>
	);
}
