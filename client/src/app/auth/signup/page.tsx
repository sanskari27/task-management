'use client';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signupSchema } from './schema';

export default function SignupPage() {
	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: '',
			password: '',
			firstName: '',
			lastName: '',
			phone: '',
		},
	});

	const onSubmit = (data: z.infer<typeof signupSchema>) => {
		console.log(data);
	};

	return (
		<Centered>
			<Card className='mx-auto max-w-md'>
				<CardHeader>
					<CardTitle className='text-xl'>Sign Up</CardTitle>
					<CardDescription>Enter your information to create an account</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<FormField
									control={form.control}
									name='firstName'
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Name</FormLabel>
											<FormControl>
												<Input required placeholder='John' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='lastName'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Last Name</FormLabel>
											<FormControl>
												<Input required placeholder='Doe' {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input required placeholder='m@example.com' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone</FormLabel>
										<FormControl>
											<Input required placeholder='91890XXXXX78' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input required type='password' placeholder='*********' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' className='w-full'>
								Create an account
							</Button>
							<Button variant='outline' className='w-full'>
								Continue with Google
							</Button>
							<div className='mt-4 text-center text-sm'>
								Already have an account?{' '}
								<Link href='/auth/login' className='underline'>
									Sign in
								</Link>
							</div>
						</form>
					</Form>
					{/* <form className='grid gap-4' onSubmit={form.handleSubmit(onSubmit)}>
						<div className='grid gap-4'>
						
					</form> */}
				</CardContent>
			</Card>
		</Centered>
	);
}
