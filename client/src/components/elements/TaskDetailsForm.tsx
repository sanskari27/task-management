'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { taskDetailsSchema } from '@/schema/task';
import OrganizationService from '@/services/organization.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';

export default function TaskDetailsForm({
	defaultValues,
	onSubmit,
	isLoading = false,
	org_id,
}: {
	defaultValues?: z.infer<typeof taskDetailsSchema>;
	onSubmit: (values: z.infer<typeof taskDetailsSchema>) => void;
	isLoading?: boolean;
	org_id: string;
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

	async function getEmployees() {
		const employees = await OrganizationService.employeeList(org_id);

		console.log(employees);
	}

	useEffect(() => {
		getEmployees();
	}, []);

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
