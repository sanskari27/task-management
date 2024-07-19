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
import Each from '../containers/each';
import ComboboxCategories from '../ui/combobox_categories';
import ComboboxEmployee from '../ui/combobox_employee';
import ComboboxMonthDays from '../ui/combobox_month_days';
import ComboboxWeekdays from '../ui/combobox_weekdays';
import { DatePickerDemo } from '../ui/date-picker';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

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
		employee_id: string;
		organization_id: string;
		can_create_others: boolean;
		can_let_others_create: boolean;
		name: string;
		email: string;
		phone: string;
	}[];
}) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const [link, setLink] = useState<string>('');
	const [files, setFiles] = useState<File[]>([]);

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			setFiles((prev) => [...prev, file]);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	const removeFile = (index: number) => {
		const newFiles = files.filter((_, i) => i !== index);
		setFiles(newFiles);
	};

	const addLink = () => {
		if (!link) return;
		setLink('');
		setValue('links', [...watch('links'), link]);
	};

	const removeLink = (index: number) => {
		const newLinks = watch('links').filter((_, i) => i !== index);
		setValue('links', newLinks);
	};

	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
		setValue,
		watch,
	} = useForm<z.infer<typeof taskDetailsSchema>>({
		resolver: zodResolver(taskDetailsSchema),
		defaultValues,
	});
	// const tz = watch('timezone');

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

	return (
		<Card className='mx-auto w-[90%] md:w-[40%]'>
			<CardHeader>
				<CardTitle className='text-xl text-center'>Task Details</CardTitle>
			</CardHeader>
			<CardContent>
				<form method='post' onSubmit={handleSubmit(formSubmit)} className='mt-6'>
					<div className='px-4 '>
						<div className='grid gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='title'>Title</Label>
								<Input
									id='title'
									placeholder='Ex. ABC Corp'
									{...register('title', { required: true })}
									onChange={() => setError('title', { message: '' })}
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='description'>Description</Label>
								<Textarea
									id='description'
									placeholder='Ex. Textile'
									{...register('description', {})}
									onChange={() => setError('description', { message: '' })}
								/>
							</div>
							<div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
								<div className='grid gap-2 grid-cols-2 items-center'>
									<Label htmlFor='assigned_separately'>Assign separately</Label>
									<Switch
										className='ml-auto md:ml-0'
										id='assigned_separately'
										checked={watch('assigned_separately')}
										onCheckedChange={(value) => setValue('assigned_separately', value)}
									/>
								</div>
								<div className='flex md:flex-row flex-col gap-4 items-start md:items-center justify-end'>
									<Label htmlFor='priority'>Priority</Label>
									<ToggleGroup
										type='single'
										value={watch('priority')}
										onValueChange={(e) => {
											if (e) {
												setValue('priority', e);
											}
										}}
									>
										<ToggleGroupItem value='low'>Low</ToggleGroupItem>
										<ToggleGroupItem value='medium'>Medium</ToggleGroupItem>
										<ToggleGroupItem value='high'>High</ToggleGroupItem>
									</ToggleGroup>
								</div>
							</div>
							<div className='grid gap-2 '>
								<Label htmlFor='assign_to'>Assign to</Label>
								<ComboboxEmployee
									items={employees}
									onChange={(value) => setValue('assigned_to', value)}
									placeholder='Select employee'
									value={watch('assigned_to')}
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='assign_to'>Categories</Label>
								<ComboboxCategories
									items={categories}
									onChange={(value) => setValue('category', value)}
									placeholder='Select category'
									value={watch('category')}
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='due_date'>Due date</Label>
								<DatePickerDemo
									onChange={(date) => setValue('due_date', date as Date)}
									value={watch('due_date')}
								/>
							</div>
							<div className='grid gap-2 grid-cols-2 justify-between items-center'>
								<Label htmlFor='recurring'>Recurring</Label>
								<Switch
									className='ml-auto'
									id='recurring'
									checked={watch('isRecurring')}
									onCheckedChange={(value) => setValue('isRecurring', value)}
								/>
							</div>
							<div className={`${watch('isRecurring') ? 'grid' : 'hidden'} gap-4`}>
								<div className={`grid gap-2 grid-cols-1 md:grid-cols-2 items-center justify-between`}>
									<Label htmlFor='frequency'>Frequency</Label>
									<ToggleGroup
										type='single'
										value={watch('recurrence.frequency')}
										onValueChange={(e) => {
											if (e) {
												setValue('recurrence.frequency', e);
											}
										}}
										className='ml-auto'
									>
										<ToggleGroupItem value='daily'>Daily</ToggleGroupItem>
										<ToggleGroupItem value='weekly'>Weekly</ToggleGroupItem>
										<ToggleGroupItem value='monthly'>Monthly</ToggleGroupItem>
									</ToggleGroup>
								</div>
								<Separator />
								<div className={'grid grid-cols-2 gap-4'}>
									<div className='grid gap-4'>
										<Label htmlFor='assign_to'>Start Date</Label>
										<DatePickerDemo
											onChange={(date) => setValue('recurrence.start_date', date as Date)}
											value={watch('recurrence.start_date')}
										/>
									</div>
									<div className='grid gap-4'>
										<Label htmlFor='assign_to'>End Date</Label>
										<DatePickerDemo
											onChange={(date) => setValue('recurrence.end_date', date as Date)}
											value={watch('recurrence.end_date')}
										/>
									</div>
								</div>
								<div
									className={` ${
										watch('recurrence.frequency') === 'weekly' ? 'grid' : 'hidden'
									} gap-4`}
								>
									<ComboboxWeekdays
										onChange={(value) => setValue('recurrence.weekdays', value)}
										placeholder='Select weekdays'
										value={watch('recurrence.weekdays')}
									/>
								</div>
								<div
									className={` ${
										watch('recurrence.frequency') === 'monthly' ? 'grid' : 'hidden'
									} gap-4`}
								>
									<ComboboxMonthDays
										onChange={(value) => setValue('recurrence.monthdays', value)}
										placeholder='Select days'
										value={watch('recurrence.monthdays')}
									/>
								</div>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='link'>Links</Label>
								<div className='flex flex-row gap-2'>
									<div className='flex-1'>
										<Input
											value={link}
											onChange={(e) => setLink(e.target.value)}
											id='link'
											placeholder='Ex. https://example.com'
										/>
									</div>
									<Button onClick={addLink} variant={'outline'}>
										+
									</Button>
								</div>
								<Each
									items={watch('links')}
									render={(link, index) => {
										return (
											<div className='flex gap-2'>
												<div className='flex-1'>
													<Input readOnly value={link} />
												</div>
												<Button onClick={() => removeLink(index)} variant={'outline'}>
													-
												</Button>
											</div>
										);
									}}
								/>
							</div>
							<div className='grid gap-4 grid-cols-2'>
								<div className='grid grid-cols-1 gap-2'>
									<Label htmlFor='files'>
										<Input
											type='button'
											onClick={() => fileInputRef.current?.click()}
											value='Select a File'
										/>
									</Label>
									<Each
										items={files}
										render={(file, index) => (
											<div className='flex flex-row w-full gap-2 whitespace-pre-wrap line-clamp-1 justify-between items-center'>
												<div>{file.name}</div>
												<Button onClick={() => removeFile(index)}>-</Button>
											</div>
										)}
									/>
									<input
										id='files'
										className='hidden'
										type='file'
										ref={fileInputRef}
										onChange={handleFileChange}
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
			</CardContent>
		</Card>
	);
}
