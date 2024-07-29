'use client';

import { HoverEffect } from '@/components/ui/card-hover-effect';

export default function StatsTemplate({
	items,
}: {
	items: { title: string; description: string; link?: string }[];
}) {
	return (
		<div className='min-w-[500px] text-center font-2xl'>
			<HoverEffect className='flex-col' items={items} />
		</div>
	);
}
