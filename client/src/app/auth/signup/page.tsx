'use client';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signupSchema } from './schema';

export default function SignupPage() {
	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			address: {
				street: '',
				city: '',
				state: '',
				country: '',
				zip: '',
			},
			domain: '',
			email: '',
			industry: '',
			logo: '',
			timeZone: '',
		},
	});

	function onSubmit(values: z.infer<typeof signupSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<Centered>
			<Card className='mx-auto max-w-md'>
				<CardHeader>
					<CardTitle className='text-xl'>Sign Up</CardTitle>
					<CardDescription>Enter your information to create an account</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='grid gap-2'>
								<Label htmlFor='first-name'>First name</Label>
								<Input id='first-name' placeholder='Max' required />
							</div>
							<div className='grid gap-2'>
								<Label htmlFor='last-name'>Last name</Label>
								<Input id='last-name' placeholder='Robinson' required />
							</div>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input id='email' type='email' placeholder='m@example.com' required />
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Phone</Label>
							<Input id='phone' type='tel' placeholder='91890XXXXX78' required />
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='password'>Password</Label>
							<Input id='password' type='password' />
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
				</CardContent>
			</Card>
		</Centered>
	);
}
