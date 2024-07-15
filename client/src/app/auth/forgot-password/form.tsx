'use client';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthService from '@/services/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { resetSchema } from './schema';

export default function LoginForm() {
	const router = useRouter();
	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resetSchema),
		defaultValues: {
			email: '',
		},
	});

	async function formSubmit(values: z.infer<typeof resetSchema>) {
		const success = await AuthService.forgotPassword(values.email);
		if (success) {
			toast.success('Password reset link sent to your email');
			router.push('/auth/login');
		} else {
			setError('email', { message: 'Invalid Credentials' });
		}
	}

	return (
		<Centered>
			<Card className='mx-auto max-w-md w-[90%] md:w-full'>
				<CardHeader>
					<CardTitle className='text-2xl text-center'>Forgot Password</CardTitle>
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
									isInvalid={!!errors.email?.message}
								/>
								<span className='text-red-500 text-sm text-center'>{errors.email?.message}</span>
							</div>

							<Button type='submit' className='w-full'>
								Continue
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
