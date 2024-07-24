import Show from '@/components/containers/show';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';
import { AlarmClock, CircleUserRound, Flag, Hourglass, Tag } from 'lucide-react';

export default function TaskCard({ task }: { task: Task }) {
	return (
		<div
			className={cn(
				'p-4 w-full border border-dashed rounded-2xl flex flex-col gap-1 bg-card cursor-grab',
				task.isOverdue && 'border-red-400'
			)}
		>
			<p className='text-xl font-medium line-clamp-1'>{task.title}</p>
			<div className='flex gap-4 items-center'>
				<span className='text-sm font-medium  flex items-center gap-1'>
					<CircleUserRound size={'0.85rem'} /> {task.created_by.name}
				</span>
				{/* <p className='w-2 h-2 rounded-full bg-foreground '></p> */}
				<span className='text-sm  flex items-center gap-1 capitalize'>
					<Tag size={'0.85rem'} /> {task.category}
				</span>
				<span className='text-sm   flex items-center gap-1 capitalize'>
					<Flag size={'0.85rem'} /> {task.priority}
				</span>
			</div>
			<div className='flex gap-4 items-center'>
				<span className='text-sm  flex items-center gap-1 capitalize'>
					<AlarmClock size={'0.85rem'} /> {task.due_date}
				</span>
				<span className='text-sm  flex items-center gap-1 capitalize'>
					<Hourglass size={'0.85rem'} /> {task.relative_date}
				</span>
				<Show>
					<Show.When condition={task.isBatchTask}>
						<span className='text-xs  '>(Recurring)</span>
					</Show.When>
				</Show>
			</div>
		</div>
	);
}
