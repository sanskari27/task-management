import Link from 'next/link';

export default function ListItem({ title, href }: { title: string; href: string }) {
	return (
		<li className='p-[0.5rem] dark:hover:bg-zinc-800 hover:bg-slate-100 rounded-lg'>
			<Link href={href}>
				<div>{title}</div>
			</Link>
		</li>
	);
}
