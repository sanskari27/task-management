'use client';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { profileSchema } from '@/schema/auth';
import AuthService from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

export default function EditProfile({
	accountDetails: { email, firstName, lastName, phone },
}: {
	accountDetails: { email: string; firstName: string; lastName: string; phone: string };
}) {
	const [loading, setLoading] = useState(false);

	const {
		handleSubmit,
		register,
		setError,
		setValue,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			email: '',
			firstName: '',
			lastName: '',
			phone: '',
		},
	});

	async function formSubmit(values: z.infer<typeof profileSchema>) {
		console.log('called');

		setLoading(true);
		const success = await AuthService.updateProfile(values);
		setLoading(false);
		if (success) {
			toast.success('Profile updated successfully');
		} else {
			setError('email', { message: 'User already exists...' });
		}
	}

	useEffect(() => {
		setValue('email', email);
		setValue('firstName', firstName);
		setValue('lastName', lastName);
		setValue('phone', phone);
	}, [email, firstName, lastName, phone, setValue]);

	return (
		<>
			<Centered>
				<Card className='mx-auto max-w-md w-[90%] md:w-full'>
					<CardHeader>
						<CardTitle className='text-xl text-center'>Profile Details</CardTitle>
						<CardDescription className='text-center'>
							These details will be further used for communication and reminders.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form method='post' onSubmit={handleSubmit(formSubmit)}>
							<div className='grid gap-4'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='grid gap-2'>
										<Label htmlFor='first-name'>First name</Label>
										<Input
											id='first-name'
											placeholder='John'
											{...register('firstName', { required: true })}
											onChange={(e) => {
												setValue('firstName', e.target.value);
												resetErrors();
											}}
										/>
									</div>
									<div className='grid gap-2'>
										<Label htmlFor='last-name'>Last name</Label>
										<Input
											id='last-name'
											placeholder='Doe'
											{...register('lastName', {})}
											onChange={(e) => {
												setValue('lastName', e.target.value);
												resetErrors();
											}}
										/>
									</div>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='email'>Phone (with country code)</Label>
									<Input
										id='phone'
										type='tel'
										placeholder='91890XXXXX78'
										{...register('phone', { required: true, pattern: /^[0-9]{12}$/ })}
										onChange={(e) => {
											setValue('phone', e.target.value);
											resetErrors();
										}}
										isInvalid={!!errors.email?.message}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='email'>Email</Label>
									<Input
										id='email'
										type='email'
										placeholder='john@example.com'
										{...register('email', { required: true, pattern: /^\S+@\S+$/i })}
										onChange={(e) => {
											setValue('email', e.target.value);
											resetErrors();
										}}
										isInvalid={!!errors.email?.message}
									/>
								</div>
								<Button type='submit' className='w-full' disabled={loading}>
									{loading && <Loader2 className='w-4 h-4 animate-spin mr-2' />}
									Edit Profile
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
				<Link href='/organizations' className='mt-2 text-center text-sm hover:underline'>
					Go to My Organizations
				</Link>
			</Centered>
		</>
	);
}
