'use client';

import Centered from '@/components/containers/centered';
import PageLayout from '@/components/containers/page-layout';
import { Button } from '@/components/ui/button';
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
		<PageLayout>
			<Centered className='w-full max-w-[400px] min-w-[300px]'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8 my-auto w-full border-zinc-400 border-2 rounded-xl p-4'
					>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<>
									<FormItem>
										<FormLabel className=''>Email</FormLabel>
										<FormControl>
											<Input placeholder='eg. john.doe@gmail.com' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder='eg. john.doe@gmail.com' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								</>
							)}
						/>
						<Button type='submit'>Submit</Button>
					</form>
				</Form>
			</Centered>
		</PageLayout>
	);
}
