import AuthService from '@/services/auth.service';
import { redirect, RedirectType } from 'next/navigation';
import SignForm from './form';
import { Suspense } from 'react';

export default async function Signup({
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
			<SignForm />
		</Suspense>
	);
}
