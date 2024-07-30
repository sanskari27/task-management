'use client';
import LinkInputDialog from '@/components/elements/LinkInputDialog';
import VoiceNoteInputDialog from '@/components/elements/VoiceNoteInputDialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { taskUpdateSchema } from '@/schema/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { LinkInputHandle } from '@/components/elements/LinkInputDialog';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import MediaService from '@/services/media.service';
import TasksService from '@/services/tasks.service';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const defaultValues = {
	message: '',
	links: [],
	files: [],
	voice_notes: [],
	status: 'in_progress' as 'in_progress' | 'pending' | 'completed',
};

export function AddUpdate({ org_id, task_id }: { org_id: string; task_id: string }) {
	const router = useRouter();
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const [isLoading, setLoading] = useState(false);
	const [files, setFiles] = useState<File[]>([]);
	const [voiceNote, setVoiceNote] = useState<Blob>();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const inputLinkRef = useRef<LinkInputHandle>(null);
	const form = useForm<z.infer<typeof taskUpdateSchema>>({
		resolver: zodResolver(taskUpdateSchema),
		defaultValues,
	});
	const links = form.watch('links');

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (files && files.length > 0) {
			setFiles(Array.from(files));
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	const handleFileSelector = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		fileInputRef.current?.click();
	};

	async function handleSubmit(values: z.infer<typeof taskUpdateSchema>) {
		setLoading(true);
		if (files.length > 0) {
			const promises = files.map((file) => {
				return MediaService.uploadFile(file);
			});
			try {
				const results = await Promise.all(promises);
				values.files = results;
			} catch (e) {
				toast.error('Error uploading files');
				setLoading(false);
				return;
			}
		}
		if (voiceNote) {
			try {
				const voice_note = await MediaService.uploadFile(voiceNote);
				values.voice_notes = [voice_note];
			} catch (e) {
				toast.error('Error uploading files');
				setLoading(false);
				return;
			}
		}
		setLoading(false);
		toast.promise(
			TasksService.addUpdate(org_id, {
				taskId: task_id,
				...values,
			}),
			{
				loading: 'Adding update...',
				success: () => {
					form.reset(defaultValues);
					setFiles([]);
					setVoiceNote(undefined);
					buttonRef.current?.click();
					router.refresh();
					return 'Update added.';
				},
				error: 'Failed to add update',
			}
		);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant='default' size={'sm'} ref={buttonRef} className='flex-1'>
					Add Update
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px] md:max-w-lg lg:max-w-2xl'>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)} className='mt-6'>
						<div className='flex flex-col px-4 gap-2 items-start flex-1'>
							<div className='w-full'>
								<FormField
									control={form.control}
									name='message'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Message</FormLabel>
											<FormControl>
												<Textarea
													className='w-full min-h-[250px]'
													placeholder='Eg. This is the latest update on...'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex gap-x-3 gap-y-2 flex-wrap mt-2'>
								<FormField
									control={form.control}
									name='status'
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Select
													value={field.value}
													onValueChange={(value) =>
														form.setValue(
															'status',
															value as 'in_progress' | 'pending' | 'completed'
														)
													}
												>
													<SelectTrigger className='w-[180px]'>
														<SelectValue placeholder='Select status' />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectLabel>Status</SelectLabel>
															<SelectItem value='pending'>Not Started</SelectItem>
															<SelectItem value='in_progress'>In Progress</SelectItem>
															<SelectItem value='completed'>Completed</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<LinkInputDialog
									ref={inputLinkRef}
									onConfirm={(links) => form.setValue('links', links)}
									links={links}
								>
									<Button variant={'outline'}>Links ({links.length} added)</Button>
								</LinkInputDialog>
								<Label htmlFor='files'>
									<Button variant={'outline'} className='w-full' onClick={handleFileSelector}>
										Files ({files.length} selected)
									</Button>
								</Label>
								<input
									id='files'
									className='hidden'
									type='file'
									ref={fileInputRef}
									onChange={handleFileChange}
									multiple
								/>
								<VoiceNoteInputDialog onConfirm={(voice_notes) => setVoiceNote(voice_notes)}>
									<Button variant={'outline'}>Voice notes</Button>
								</VoiceNoteInputDialog>
							</div>
						</div>
						<DialogFooter>
							<Button type='submit' className=' mt-6 w-[96%] mx-[2%]' disabled={isLoading}>
								{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
