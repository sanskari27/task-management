'use client';
import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthService from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { resetSchema } from './schema';

export default function ResetPassword() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	async function formSubmit(values: z.infer<typeof resetSchema>) {
		const code = searchParams.get('code');
		if (!code) {
			return toast.error('Invalid reset request');
		}
		const success = await AuthService.resetPassword(code, values.password);
		if (success) {
			router.push('/organizations');
		} else {
			setError('password', { message: 'Invalid password reset token.' });
		}
	}

	useEffect(() => {
		if (!searchParams.get('code')) {
			router.push('/auth/login');
		}
	}, [searchParams, router]);

	return (
		<Centered>
			<Card className='mx-auto max-w-md w-[90%] md:w-full'>
				<CardHeader>
					<CardTitle className='text-2xl text-center'>Reset Password</CardTitle>
					<CardDescription className='text-center'>Enter your new credentials</CardDescription>
				</CardHeader>
				<CardContent>
					<form method='post' onSubmit={handleSubmit(formSubmit)}>
						<div className='grid gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='password'>New Password</Label>
								<Input
									type='password'
									{...register('password', { required: true, minLength: 8 })}
									onChange={() => resetErrors()}
									isInvalid={!!errors.password?.message}
								/>
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='password'>Confirm Password</Label>
								<Input
									type='password'
									{...register('confirmPassword', { required: true, minLength: 8 })}
									onChange={() => resetErrors()}
									isInvalid={!!errors.password?.message}
								/>
								<span className='text-red-500 text-sm text-center'>{errors.password?.message}</span>
							</div>
							<Button type='submit' className='w-full'>
								Reset Password
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</Centered>
	);
}
