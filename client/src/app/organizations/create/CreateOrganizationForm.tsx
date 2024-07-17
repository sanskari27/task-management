'use client';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { organizationSchema } from './organizationSchema';
import { DEFAULT_GALLERY } from '@/assets/image';

export default function CreateOrganizationForm() {
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const router = useRouter();
	const searchParams = useSearchParams();
	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm<z.infer<typeof organizationSchema>>({
		resolver: zodResolver(organizationSchema),
		defaultValues: {
			address: {
				city: '',
				country: '',
				state: '',
				street: '',
				zip: '',
			},
			domain: '',
			industry: '',
			logo: '',
			name: '',
			timezone: '',
		},
	});

	async function formSubmit(values: z.infer<typeof organizationSchema>) {
		// const success = await AuthService.register(values);
		// if (success) {
		// 	router.push(searchParams.get('callback') ?? '/');
		// } else {
		// 	setError('email', { message: 'User already exists...' });
		// }
	}

	return (
		<Centered>
			<Card className='mx-auto max-w-md w-[90%] md:w-full'>
				<CardHeader>
					<CardTitle className='text-xl text-center'>Organization Details</CardTitle>
					<Centered>
						<Label htmlFor='logo'>
							<Image src={logoFile ? logoFile : DEFAULT_GALLERY} alt='Organization Logo' className='w-24 h-24 rounded-full border' />
						</Label>
						<Input id='logo' className='hidden' type='file' />
					</Centered>
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
										onChange={() => resetErrors()}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='last-name'>Last name</Label>
									<Input
										id='last-name'
										placeholder='Doe'
										{...register('lastName', {})}
										onChange={() => resetErrors()}
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
									onChange={() => resetErrors()}
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
									onChange={() => resetErrors()}
									isInvalid={!!errors.email?.message}
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='password'>Password</Label>
								<Input
									id='password'
									type='password'
									{...register('password', { required: true, minLength: 8 })}
									onChange={() => resetErrors()}
									isInvalid={!!errors.email?.message}
								/>
								<span className='text-red-500 text-sm text-center'>{errors.email?.message}</span>
							</div>
							<Button type='submit' className='w-full'>
								Create an account
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</Centered>
	);
}
