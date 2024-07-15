import AuthService from '@/services/auth';
import { redirect, RedirectType } from 'next/navigation';
import ForgotPasswordForm from './form';

export default async function ForgotPassword({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const success = await AuthService.isUserAuthenticated();

	if (success) {
		const redirectUrl = (searchParams['callback'] as string) ?? '/dashboard';
		redirect(redirectUrl, RedirectType.replace);
	}

	return <ForgotPasswordForm />;
}
