'use client';
import { useOrganizationDetails } from '@/components/context/organization-details';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
export function MarkInactive({ org_id, task_id }: { org_id: string; task_id: string }) {
	const router = useRouter();
	const { is_owner } = useOrganizationDetails();
	function handleClick() {
		toast.promise(TasksService.markInactive(org_id, task_id), {
			loading: 'Marking task as inactive...',
			success: () => {
				const now = new Date();
				const start_date = new Date(now);
				const end_date = new Date(now);
				start_date.setHours(0, 0, 0, 0);
				end_date.setHours(23, 59, 59, 999);

				router.replace(
					`/organizations/${org_id}/tasks/my-tasks?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`
				);
				return 'Task marked as inactive';
			},
			error: 'Failed to mark task as inactive',
		});
	}

	if (!is_owner) {
		return null;
	}
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant={'destructive'} size={'sm'}>
					Mark Inactive
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						Marking this task as inactive will mark all the subsequent tasks as inactive as well.
						Once marked as inactive, you can&apos;t undo this action.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
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
