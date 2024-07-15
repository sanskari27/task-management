import AuthService from '@/services/auth';
import { redirect, RedirectType } from 'next/navigation';
import SignForm from './form';

export default async function Signup({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const success = await AuthService.isUserAuthenticated();

	if (success) {
		const redirectUrl = (searchParams['callback'] as string) ?? '/dashboard';
		redirect(redirectUrl, RedirectType.replace);
	}

	return <SignForm />;
}
