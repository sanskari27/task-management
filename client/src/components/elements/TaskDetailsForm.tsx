'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { taskDetailsSchema } from '@/schema/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ComboboxCategories from '../ui/combobox_categories';
import ComboboxEmployee from '../ui/combobox_employee';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

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
		<Card className='mx-auto max-w-[40%] w-[90%] md:w-full'>
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
							<div className='grid gap-4 grid-cols-2'>
								<div className='grid gap-2 grid-cols-2 items-center'>
									<Label htmlFor='assigned_separately'>Assign separately</Label>
									<Switch
										id='assigned_separately'
										checked={watch('assigned_separately')}
										onCheckedChange={(value) => setValue('assigned_separately', value)}
									/>
								</div>
								<div className='grid gap-2 grid-cols-4 items-center'>
									<Label htmlFor='priority'>Priority</Label>
									<Button
										onClick={() => setValue('priority', 'low')}
										variant={watch('priority') === 'low' ? 'default' : 'ghost'}
									>
										Low
									</Button>
									<Button
										onClick={() => setValue('priority', 'medium')}
										variant={watch('priority') === 'medium' ? 'default' : 'ghost'}
									>
										Medium
									</Button>
									<Button
										onClick={() => setValue('priority', 'high')}
										variant={watch('priority') === 'high' ? 'default' : 'ghost'}
									>
										High
									</Button>
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
							<div className='grid gap-2 grid-cols-2 justify-between'>
								<Label htmlFor='recurring'>Recurring</Label>
								<Switch
									className='ml-auto'
									id='recurring'
									checked={watch('isRecurring')}
									onCheckedChange={(value) => setValue('isRecurring', value)}
								/>
							</div>
							<div
								className={`gap-2 grid-cols-4 items-center ${
									watch('isRecurring') ? 'grid' : 'hidden'
								}`}
							>
								<Label htmlFor='frequency'>Frequency</Label>
								<Button
									onClick={() => setValue('recurrence.frequency', 'daily')}
									variant={watch('recurrence.frequency') === 'daily' ? 'default' : 'ghost'}
								>
									Daily
								</Button>
								<Button
									onClick={() => setValue('recurrence.frequency', 'weekly')}
									variant={watch('recurrence.frequency') === 'weekly' ? 'default' : 'ghost'}
								>
									Weekly
								</Button>
								<Button
									onClick={() => setValue('recurrence.frequency', 'monthly')}
									variant={watch('recurrence.frequency') === 'monthly' ? 'default' : 'ghost'}
								>
									Monthly
								</Button>
							</div>
                            <div>
                                
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
