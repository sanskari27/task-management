'use client';
import { Button } from '@/components/ui/button';
import TasksService from '@/services/tasks.service';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export function MarkCompleted({ org_id, task_id }: { org_id: string; task_id: string }) {
	const router = useRouter();
	function handleClick() {
		toast.promise(TasksService.updateStatus(org_id, { taskId: task_id, status: 'completed' }), {
			loading: 'Marking as completed...',
			success: () => {
				router.refresh();
				return 'Marked as completed';
			},
			error: 'Failed to mark task as completed',
		});
	}

	return (
		<Button variant={'outline'} size={'sm'} onClick={handleClick}>
			Completed
		</Button>
	);
}
export function MarkPending({ org_id, task_id }: { org_id: string; task_id: string }) {
	const router = useRouter();
	function handleClick() {
		toast.promise(TasksService.updateStatus(org_id, { taskId: task_id, status: 'pending' }), {
			loading: 'Updating task status...',
			success: () => {
				router.refresh();
				return 'Task status updated';
			},
			error: 'Failed to update task status',
		});
	}

	return (
		<Button variant={'outline'} size={'sm'} onClick={handleClick}>
			Not Started
		</Button>
	);
}
export function MarkInProgress({ org_id, task_id }: { org_id: string; task_id: string }) {
	const router = useRouter();
	function handleClick() {
		toast.promise(TasksService.updateStatus(org_id, { taskId: task_id, status: 'in_progress' }), {
			loading: 'Updating task status...',
			success: () => {
				router.refresh();
				return 'Task status updated';
			},
			error: 'Failed to update task status',
		});
	}

	return (
		<Button variant={'outline'} size={'sm'} onClick={handleClick}>
			In Progress
		</Button>
	);
}
