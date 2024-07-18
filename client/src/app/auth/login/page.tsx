import AuthService from '@/services/auth.service';
import { redirect, RedirectType } from 'next/navigation';
import LoginForm from './form';

export default async function Login({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const success = await AuthService.isUserAuthenticated();

	if (success) {
		const redirectUrl = (searchParams['callback'] as string) ?? '/organizations';
		redirect(redirectUrl, RedirectType.replace);
	}

	return <LoginForm />;
}
