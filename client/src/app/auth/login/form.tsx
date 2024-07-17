'use client';

import Link from 'next/link';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginSchema } from '@/schema/auth';
import AuthService from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function formSubmit(values: z.infer<typeof loginSchema>) {
		const success = await AuthService.login(values.email, values.password);
		if (success) {
			router.push(searchParams.get('callback') ?? '/');
		} else {
			setError('password', { message: 'Invalid Credentials' });
		}
	}

	return (
		<Centered>
			<Card className='mx-auto max-w-md w-[90%] md:w-full'>
				<CardHeader>
					<CardTitle className='text-2xl text-center'>Login</CardTitle>
					<CardDescription className='text-center'>Enter your credentials</CardDescription>
				</CardHeader>
				<CardContent>
					<form method='post' onSubmit={handleSubmit(formSubmit)}>
						<div className='grid gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									type='email'
									placeholder='john@example.com'
									{...register('email', { required: true, pattern: /^\S+@\S+$/i })}
									onChange={() => resetErrors()}
									isInvalid={!!errors.password?.message}
								/>
							</div>
							<div className='grid gap-2'>
								<div className='flex items-center'>
									<Label htmlFor='password'>Password</Label>
									<Link
										href='/auth/forgot-password'
										className='ml-auto inline-block text-sm underline'
									>
										Forgot your password?
									</Link>
								</div>
								<Input
									type='password'
									{...register('password', { required: true, minLength: 8 })}
									onChange={() => resetErrors()}
									isInvalid={!!errors.password?.message}
								/>
								<span className='text-red-500 text-sm text-center'>{errors.password?.message}</span>
							</div>
							<Button type='submit' className='w-full'>
								Login
							</Button>
							<Button variant='outline' className='w-full'>
								Continue with Google
							</Button>
						</div>
						<div className='mt-4 text-center text-sm'>
							Don&apos;t have an account?{' '}
							<Link href='/auth/signup' className='underline'>
								Sign up
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</Centered>
	);
}
