import AuthService from '@/services/auth.service';
import { redirect, RedirectType } from 'next/navigation';
import { Suspense } from 'react';
import ForgotPasswordForm from './form';

export default async function ForgotPassword({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const success = await AuthService.isUserAuthenticated();

	if (success) {
		const redirectUrl = (searchParams['callback'] as string) ?? '/organizations';
		redirect(redirectUrl, RedirectType.replace);
	}

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ForgotPasswordForm />
		</Suspense>
	);
}
