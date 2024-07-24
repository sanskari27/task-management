'use client';

import Centered from '@/components/containers/centered';
import { taskDetailsSchema } from '@/schema/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Show from '@/components/containers/show';
import LinkInputDialog, { LinkInputHandle } from '@/components/elements/LinkInputDialog';
import ReminderInputDialog from '@/components/elements/ReminderInputDialog';
import VoiceNoteInputDialog from '@/components/elements/VoiceNoteInputDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ComboboxCategories from '@/components/ui/combobox_categories';
import ComboboxEmployee from '@/components/ui/combobox_employee';
import ComboboxMonthDays from '@/components/ui/combobox_month_days';
import ComboboxWeekdays from '@/components/ui/combobox_weekdays';
import { DatePickerDemo } from '@/components/ui/date-picker';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import MediaService from '@/services/media.service';
import TasksService from '@/services/tasks.service';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'react-hot-toast';

const defaultValues = {
	title: '',
	description: '',
	assign_separately: false,
	assigned_to: [],
	category: '',
	priority: 'low',
	isRecurring: false,
	recurrence: {
		frequency: 'daily',
		start_date: new Date(),
		end_date: new Date(new Date().setDate(new Date().getDate() + 365)),
		weekdays: [],
		monthdays: [],
	},
	due_date: new Date(),
	links: [],
	files: [],
	voice_notes: [],
	reminders: [],
};

export default function CreateTasks({ params: { org_id } }: { params: { org_id: string } }) {
	const [isLoading, setLoading] = useState(false);
	const router = useRouter();

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const inputLinkRef = useRef<LinkInputHandle>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [voiceNote, setVoiceNote] = useState<Blob>();
	const [time, setTime] = useState('00:00');

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (files && files.length > 0) {
			setFiles(Array.from(files));
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	const form = useForm<z.infer<typeof taskDetailsSchema>>({
		resolver: zodResolver(taskDetailsSchema),
		defaultValues,
	});
	const priority = form.watch('priority');
	const assign_separately = form.watch('assign_separately');
	const due_date = form.watch('due_date');
	const isRecurring = form.watch('isRecurring');
	const recurringFrequency = form.watch('recurrence.frequency');
	const startDate = form.watch('recurrence.start_date');
	const endDate = form.watch('recurrence.end_date');
	const recurringWeekDays = form.watch('recurrence.weekdays');
	const recurringMonthDays = form.watch('recurrence.monthdays');
	const links = form.watch('links');
	const reminders = form.watch('reminders');

	const handleFileSelector = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		fileInputRef.current?.click();
	};
	console.log(new Date(`${due_date.toISOString().split('T')[0]}T${time}`), time);

	async function handleSubmit(values: z.infer<typeof taskDetailsSchema>) {
		setLoading(true);
		values.due_date = new Date(`${due_date.toISOString().split('T')[0]}T${time}`);

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
		console.log(values);
		toast.promise(TasksService.createTask(org_id, values), {
			loading: 'Assigning task...',
			success: () => {
				router.push(`/organizations/${org_id}/tasks/delegated-tasks`);
				return 'Task assigned successfully';
			},
			error: 'Error assigning task',
		});
	}

	return (
		<Centered className='mt-[15%] md:mt-0'>
			<Card className='mx-auto w-[90%] md:max-w-[80%] lg:max-w-[60%]'>
				<CardHeader>
					<CardTitle
						className='text-xl text-center'
						onClick={() => console.log(form.watch('files'))}
					>
						Task Details
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)} className='mt-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 px-4 gap-4 items-start'>
								<div className='grid gap-4 md:mr-2'>
									<div className='grid gap-2'>
										<FormField
											control={form.control}
											name='title'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Title</FormLabel>
													<FormControl>
														<Input placeholder='Eg. ABC Crops' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className='grid gap-2'>
										<FormField
											control={form.control}
											name='description'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Description</FormLabel>
													<FormControl>
														<Textarea placeholder='Eg. Textile' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className='flex gap-4 items-center'>
										<Label htmlFor='priority'>Priority</Label>
										<ToggleGroup
											type='single'
											value={priority}
											onValueChange={(e) => {
												if (e) {
													form.setValue('priority', e);
												}
											}}
											className='md:ml-auto justify-evenly'
										>
											<ToggleGroupItem value='low'>Low</ToggleGroupItem>
											<ToggleGroupItem value='medium'>Medium</ToggleGroupItem>
											<ToggleGroupItem value='high'>High</ToggleGroupItem>
										</ToggleGroup>
									</div>
									<div className='grid gap-4'>
										<div className='grid gap-2 grid-cols-2 items-center'>
											<Label htmlFor='assign_separately'>Assign separately</Label>
											<Switch
												className='ml-auto '
												id='assign_separately'
												checked={assign_separately}
												onCheckedChange={(value) => {
													form.setValue('assign_separately', value);
													console.log(assign_separately);
												}}
											/>
										</div>
									</div>
									<div className='grid gap-2 '>
										<FormField
											control={form.control}
											name='assigned_to'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Assign To</FormLabel>
													<FormControl>
														<ComboboxEmployee
															value={field.value}
															onChange={(employees) => field.onChange(employees)}
															placeholder='Select Employee'
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className='grid gap-2'>
										<FormField
											control={form.control}
											name='category'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Category</FormLabel>
													<FormControl>
														<ComboboxCategories
															value={field.value}
															onChange={(category) => field.onChange(category)}
															placeholder='Select Category'
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
								<div className='flex flex-col gap-3'>
									<div className='flex gap-2 justify-between'>
										<Label htmlFor='recurring'>Recurring</Label>
										<Switch
											className='ml-auto'
											id='recurring'
											checked={isRecurring}
											onCheckedChange={(value) => form.setValue('isRecurring', value)}
										/>
									</div>
									<Show>
										<Show.When condition={isRecurring}>
											<div className={`flex flex-col gap-4`}>
												<div className={`flex md:flex-row flex-col items-center justify-between`}>
													<Label htmlFor='frequency'>Frequency</Label>
													<ToggleGroup
														type='single'
														value={recurringFrequency}
														onValueChange={(e) => {
															if (e) {
																form.setValue('recurrence.frequency', e);
															}
														}}
													>
														<ToggleGroupItem value='daily'>Daily</ToggleGroupItem>
														<ToggleGroupItem value='weekly'>Weekly</ToggleGroupItem>
														<ToggleGroupItem value='monthly'>Monthly</ToggleGroupItem>
													</ToggleGroup>
												</div>
												<Separator />
												<div className={'grid grid-cols-2 gap-4'}>
													<div className='grid gap-4'>
														<FormField
															control={form.control}
															name='recurrence.start_date'
															render={() => (
																<FormItem>
																	<FormLabel>Start Date</FormLabel>
																	<FormControl>
																		<DatePickerDemo
																			onChange={(date) =>
																				form.setValue('recurrence.start_date', date as Date)
																			}
																			value={startDate}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
													<div className='grid gap-4'>
														<FormField
															control={form.control}
															name='recurrence.end_date'
															render={({ field }) => (
																<FormItem>
																	<FormLabel>End Date</FormLabel>
																	<FormControl>
																		<DatePickerDemo
																			onChange={(date) =>
																				form.setValue('recurrence.end_date', date as Date)
																			}
																			value={endDate}
																		/>
																	</FormControl>
																	<FormMessage />
																</FormItem>
															)}
														/>
													</div>
												</div>
												<div
													className={` ${
														recurringFrequency === 'weekly' ? 'grid' : 'hidden'
													} gap-4`}
												>
													<FormField
														control={form.control}
														name='recurrence.weekdays'
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<ComboboxWeekdays
																		onChange={(value) =>
																			form.setValue('recurrence.weekdays', value)
																		}
																		placeholder='Select weekdays'
																		value={recurringWeekDays}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
												<div
													className={` ${
														recurringFrequency === 'monthly' ? 'grid' : 'hidden'
													} gap-4`}
												>
													<FormField
														control={form.control}
														name='recurrence.monthdays'
														render={({ field }) => (
															<FormItem>
																<FormControl>
																	<ComboboxMonthDays
																		onChange={(value) =>
																			form.setValue('recurrence.monthdays', value)
																		}
																		placeholder='Select days'
																		value={recurringMonthDays}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											</div>
										</Show.When>
										<Show.Else>
											<div className='flex flex-row gap-2'>
												<FormField
													control={form.control}
													name='due_date'
													render={() => (
														<FormItem className='flex-1'>
															<FormLabel>Due Date</FormLabel>
															<FormControl>
																<DatePickerDemo
																	onChange={(date) => form.setValue('due_date', date as Date)}
																	value={due_date}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
												<FormField
													control={form.control}
													name='due_date'
													render={() => (
														<FormItem className='flex-1'>
															<FormLabel>Due Time</FormLabel>
															<FormControl>
																<Input
																	required
																	type='time'
																	value={time}
																	onChange={(e) => setTime(e.target.value)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</Show.Else>
									</Show>

									<div className='flex flex-col gap-2 grid-cols-2'>
										<div className='flex flex-col gap-2'>
											<LinkInputDialog
												ref={inputLinkRef}
												onConfirm={(links) => form.setValue('links', links)}
												links={links}
											>
												<Button variant={'outline'}>Links ({links.length} added)</Button>
											</LinkInputDialog>
										</div>
										<div className='grid grid-cols-1 gap-2'>
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
										</div>
										<div className='grid grid-cols-1 gap-2'>
											<VoiceNoteInputDialog onConfirm={(voice_notes) => setVoiceNote(voice_notes)}>
												<Button variant={'outline'}>Voice notes</Button>
											</VoiceNoteInputDialog>
										</div>
										<div className='flex flex-col gap-2'>
											<ReminderInputDialog
												onConfirm={(reminder) => {
													form.setValue('reminders', reminder);
												}}
												reminders={reminders}
											>
												<Button variant={'outline'}>Reminders ({reminders.length} added)</Button>
											</ReminderInputDialog>
										</div>
									</div>
								</div>
							</div>
							<Button type='submit' className=' mt-6 w-[96%] mx-[2%]' disabled={isLoading}>
								{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Save
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</Centered>
	);
}
