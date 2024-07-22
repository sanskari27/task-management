'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { taskDetailsSchema } from '@/schema/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ComboboxCategories from '../ui/combobox_categories';
import ComboboxEmployee from '../ui/combobox_employee';
import ComboboxMonthDays from '../ui/combobox_month_days';
import ComboboxWeekdays from '../ui/combobox_weekdays';
import { DatePickerDemo } from '../ui/date-picker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import LinkInputDialog, { LinkInputHandle } from './LinkInputDialog';

export default function TaskDetailsForm({
	categories,
	defaultValues,
	onSubmit,
	isLoading = false,
	employees,
}: {
	categories: string[];
	defaultValues?: z.infer<typeof taskDetailsSchema>;
	onSubmit: (values: z.infer<typeof taskDetailsSchema>) => void;
	isLoading?: boolean;
	employees: {
		id: string;
		can_create_others: boolean;
		can_let_others_create: boolean;
		name: string;
		email: string;
		phone: string;
	}[];
}) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const inputLinkRef = useRef<LinkInputHandle>(null);
	const [files, setFiles] = useState<File[]>([]);

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
	// const tz = form.watch('timezone');

	async function formSubmit(values: z.infer<typeof taskDetailsSchema>) {
		// if (logoFile) {
		// 	const name = await MediaService.uploadFile(logoFile.file);
		// 	if (!name) {
		// 		toast.error('Failed to upload logo');
		// 		return;
		// 	}
		// 	values.logo = name;
		// }
		console.log(values);
		onSubmit(values);
	}

	const handleFileSelector = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		fileInputRef.current?.click();
	};

	return (
		<Card className='mx-auto w-[90%] md:w-[800px]'>
			<CardHeader>
				<CardTitle className='text-xl text-center'>Task Details</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(formSubmit)} className='mt-6'>
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
										value={form.watch('priority')}
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
										<Label htmlFor='assigned_separately'>Assign separately</Label>
										<Switch
											className='ml-auto '
											id='assigned_separately'
											checked={form.watch('assigned_separately')}
											onCheckedChange={(value) => form.setValue('assigned_separately', value)}
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
													<ComboboxEmployee {...field} placeholder='Select Employee' />
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
													<ComboboxCategories {...field} placeholder='Select Category' />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
							<div className='flex flex-col gap-4'>
								<div className='flex flex-col gap-2'>
									<FormField
										control={form.control}
										name='due_date'
										render={() => (
											<FormItem>
												<FormLabel>Due Date</FormLabel>
												<FormControl>
													<DatePickerDemo
														onChange={(date) => form.setValue('due_date', date as Date)}
														value={form.watch('due_date')}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className='flex gap-2 justify-between'>
									<Label htmlFor='recurring'>Recurring</Label>
									<Switch
										className='ml-auto'
										id='recurring'
										checked={form.watch('isRecurring')}
										onCheckedChange={(value) => form.setValue('isRecurring', value)}
									/>
								</div>
								<div className={`${form.watch('isRecurring') ? 'flex flex-col' : 'hidden'} gap-4`}>
									<div className={`flex md:flex-row flex-col items-center justify-between`}>
										<Label htmlFor='frequency'>Frequency</Label>
										<ToggleGroup
											type='single'
											value={form.watch('recurrence.frequency')}
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
																value={form.watch('recurrence.start_date')}
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
																value={form.watch('recurrence.end_date')}
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
											form.watch('recurrence.frequency') === 'weekly' ? 'grid' : 'hidden'
										} gap-4`}
									>
										<FormField
											control={form.control}
											name='recurrence.weekdays'
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<ComboboxWeekdays
															onChange={(value) => form.setValue('recurrence.weekdays', value)}
															placeholder='Select weekdays'
															value={form.watch('recurrence.weekdays')}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div
										className={` ${
											form.watch('recurrence.frequency') === 'monthly' ? 'grid' : 'hidden'
										} gap-4`}
									>
										<FormField
											control={form.control}
											name='recurrence.monthdays'
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<ComboboxMonthDays
															onChange={(value) => form.setValue('recurrence.monthdays', value)}
															placeholder='Select days'
															value={form.watch('recurrence.monthdays')}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
								<div className='flex flex-col gap-2'>
									<LinkInputDialog
										ref={inputLinkRef}
										onConfirm={(links) => form.setValue('links', links)}
									>
										<Button
											variant={'outline'}
											onClick={() => {
												inputLinkRef.current?.setLink(form.watch('links'));
											}}
										>
											Set Links ({form.watch('links').length})
										</Button>
									</LinkInputDialog>
								</div>
								<div className='flex flex-col gap-4 grid-cols-2'>
									<div className='grid grid-cols-1 gap-2'>
										<Label htmlFor='files'>
											<Button variant={'outline'} className='w-full' onClick={handleFileSelector}>
												Select Files ({files.length})
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
										<Button variant={'outline'}>Voice notes</Button>
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
	);
}
