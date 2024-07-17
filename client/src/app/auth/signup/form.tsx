'use client';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupSchema } from '@/schema/auth';
import AuthService from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function SignupPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			phone: '',
		},
	});

	async function formSubmit(values: z.infer<typeof signupSchema>) {
		const success = await AuthService.register(values);
		if (success) {
			router.push(searchParams.get('callback') ?? '/');
		} else {
			setError('email', { message: 'User already exists...' });
		}
	}

	return (
		<Centered>
			<Card className='mx-auto max-w-md w-[90%] md:w-full'>
				<CardHeader>
					<CardTitle className='text-xl text-center'>Sign Up</CardTitle>
					<CardDescription className='text-center'>
						Enter your information to create an account
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
							<Button variant='outline' className='w-full'>
								Continue with Google
							</Button>
						</div>
						<div className='mt-4 text-center text-sm'>
							Already have an account?{' '}
							<Link href='/auth/login' className='underline'>
								Sign in
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</Centered>
	);
}
