'use client';
import Centered from '@/components/containers/centered';
import PageLayout from '@/components/containers/page-layout';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from '@/components/ui/input-otp';
import { organizationDetailsSchema } from '@/schema/organization';
import OrganizationService from '@/services/organization.service';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';
import OrganizationDetailsForm from '../../../components/elements/OrganizationDetailsForm';

const defaultValues = {
	name: '',
	industry: '',
	domain: '',
	logo: '',
	address: {
		street: '',
		city: '',
		state: '',
		zip: '',
		country: '',
	},
	timezone: '',
};

export default function CreateOrganization() {
	const [isLoading, setLoading] = useState(false);
	const [isCouponInputOpen, setCouponInputOpen] = useState(false);
	const [couponCode, setCouponCode] = useState('');
	const router = useRouter();
	const [data, setData] = useState<z.infer<typeof organizationDetailsSchema>>(defaultValues);

	useEffect(() => {
		function pasteHandler(event: ClipboardEvent) {
			event.preventDefault();
			let paste = (event.clipboardData || (window as any).clipboardData).getData('text');
			paste = paste.toUpperCase().replace(/[^A-Z0-9]/g, '');
			setCouponCode(paste);
		}
		document.addEventListener('paste', pasteHandler);

		return () => {
			document.removeEventListener('paste', pasteHandler);
		};
	}, []);

	async function handleSubmit(values: z.infer<typeof organizationDetailsSchema>) {
		setData(values);
		setCouponCode('');
		setCouponInputOpen(true);
	}

	async function createOrganization() {
		setLoading(true);
		const id = await OrganizationService.createOrganization({
			code: couponCode,
			...data,
		});
		if (!id) {
			toast.error('Failed to create organization');
			setLoading(false);
			return;
		}
		toast.success('Organization created successfully');
		router.push(`/organizations/${id}`);
	}

	return (
		<PageLayout>
			<div className='m-6'>
				<Link href='/organizations' className='inline-flex  items-center'>
					<ChevronLeft className='inline-block w-4 h-4 ' />
					Back to Organizations
				</Link>
			</div>
			<Centered>
				<OrganizationDetailsForm
					defaultValues={defaultValues}
					onSubmit={handleSubmit}
					isLoading={isLoading}
					canEdit
				/>
			</Centered>
			<AlertDialog open={isCouponInputOpen} onOpenChange={setCouponInputOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Coupon Code</AlertDialogTitle>
						<AlertDialogDescription>
							Please enter the coupon code you received in your email to continue.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<InputOTP
						maxLength={8}
						pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
						value={couponCode}
						onChange={(val) => setCouponCode(val.toUpperCase())}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
							<InputOTPSlot index={3} />
						</InputOTPGroup>
						<InputOTPSeparator />
						<InputOTPGroup>
							<InputOTPSlot index={4} />
							<InputOTPSlot index={5} />
							<InputOTPSlot index={6} />
							<InputOTPSlot index={7} />
						</InputOTPGroup>
					</InputOTP>
					<AlertDialogDescription>
						Please contact support if you need help.{' '}
						<a href='mailto:support.wautopilot.com'>@support.wautopilot.com</a>
					</AlertDialogDescription>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={createOrganization}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</PageLayout>
	);
}
