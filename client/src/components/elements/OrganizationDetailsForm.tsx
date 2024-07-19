'use client';

import Centered from '@/components/containers/centered';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Combobox from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TIMEZONES } from '@/lib/const';
import { cn } from '@/lib/utils';
import { organizationDetailsSchema } from '@/schema/organization';
import MediaService from '@/services/media.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CgOrganisation } from 'react-icons/cg';
import { z } from 'zod';
import Show from '../containers/show';

export default function OrganizationDetailsForm({
	defaultValues,
	onSubmit,
	isLoading = false,
	canEdit = false,
}: {
	defaultValues?: z.infer<typeof organizationDetailsSchema>;
	onSubmit: (values: z.infer<typeof organizationDetailsSchema>) => void;
	isLoading?: boolean;
	canEdit?: boolean;
}) {
	const [logoFile, setLogoFile] = useState<{
		file: File;
		preview: string;
	} | null>(null);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const timezones = TIMEZONES.map((tz) => ({
		value: tz,
		label: tz,
	}));

	const {
		handleSubmit,
		register,
		setError,
		clearErrors: resetErrors,
		formState: { errors },
		setValue,
		watch,
	} = useForm<z.infer<typeof organizationDetailsSchema>>({
		resolver: zodResolver(organizationDetailsSchema),
		defaultValues,
	});
	const tz = watch('timezone');

	async function formSubmit(values: z.infer<typeof organizationDetailsSchema>) {
		if (logoFile) {
			const name = await MediaService.uploadFile(logoFile.file);
			if (!name) {
				toast.error('Failed to upload logo');
				return;
			}
			values.logo = name;
		}
		console.log(values);
		onSubmit(values);
	}

	function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const files = event.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			const preview = URL.createObjectURL(file);
			setLogoFile({
				file,
				preview,
			});
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}

	return (
		<Card className='mx-auto max-w-[60%] w-[90%] md:w-full'>
			<CardHeader>
				<CardTitle className='text-xl text-center'>Organization Details</CardTitle>
			</CardHeader>
			<CardContent>
				<Centered>
					<Label htmlFor='logo' className='cursor-pointer'>
						{logoFile ? (
							<Image
								src={logoFile.preview}
								alt='Organization Logo'
								width={96}
								height={96}
								className='w-24 h-24 rounded-full border'
							/>
						) : defaultValues?.logo ? (
							<Image
								src={`${process.env.NEXT_PUBLIC_API_URL}media/${defaultValues.logo}`}
								alt='Organization Logo'
								width={96}
								height={96}
								className='w-24 h-24 rounded-full border'
							/>
						) : (
							<div
								className={cn(
									'border-2 border-gray-500   rounded-full border-dashed h-24 w-24 inline-flex justify-center items-center',
									errors.logo && 'border-red-400'
								)}
							>
								<CgOrganisation className='w-12 h-12' />
							</div>
						)}
					</Label>
					<Input
						id='logo'
						className='hidden'
						type='file'
						ref={fileInputRef}
						onChange={handleFileChange}
						accept='image/*'
					/>
				</Centered>
				<form method='post' onSubmit={handleSubmit(formSubmit)} className='mt-6'>
					<div className='flex flex-col md:flex-row '>
						<div className='flex flex-1 flex-col border-r-0 border-b md:border-b-0 md:border-r border-dashed px-4 '>
							<div className='grid gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='name'>Name</Label>
									<Input
										id='name'
										placeholder='Ex. ABC Corp'
										{...register('name', { required: true })}
										onChange={() => setError('name', { message: '' })}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='industry'>Industry</Label>
									<Input
										id='industry'
										placeholder='Ex Textile'
										{...register('industry', {})}
										onChange={() => setError('industry', { message: '' })}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='domain'>Domain</Label>
									<Input
										id='domain'
										placeholder='Ex. abc.com'
										{...register('domain', {})}
										onChange={() => setError('domain', { message: '' })}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='timezone'>Timezone</Label>
									<Combobox
										placeholder='Select timezone'
										items={timezones}
										value={tz}
										onChange={(value) => setValue('timezone', value)}
									/>
								</div>
							</div>
						</div>
						<div className='px-4 flex-1'>
							<div className='grid gap-4'>
								<div className='grid gap-2'>
									<Label htmlFor='address.city'>City</Label>
									<Input
										autoComplete='new-password'
										id='address.city'
										placeholder='Ex Gurugram'
										{...register('address.city', {})}
										onChange={() => setError('address.city', { message: '' })}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='address.state'>State</Label>
									<Input
										autoComplete='new-password'
										id='address.state'
										placeholder='Ex. Haryana'
										{...register('address.state', {})}
										onChange={() => setError('address.state', { message: '' })}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='address.country'>Country</Label>
									<Input
										autoComplete='new-password'
										id='address.country'
										placeholder='Ex. India'
										{...register('address.country', {})}
										onChange={() => setError('address.country', { message: '' })}
									/>
								</div>
								<div className='grid gap-2'>
									<Label htmlFor='address.zip'>Pincode</Label>
									<Input
										autoComplete='new-password'
										id='address.zip'
										placeholder='Ex. 888888'
										{...register('address.zip', {})}
										onChange={() => setError('address.zip', { message: '' })}
									/>
								</div>
							</div>
						</div>
					</div>
					<Show>
						<Show.When condition={canEdit}>
							<Button type='submit' className=' mt-6 w-[96%] mx-[2%]' disabled={isLoading}>
								{isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
								Save
							</Button>
						</Show.When>
					</Show>
				</form>
			</CardContent>
		</Card>
	);
}
