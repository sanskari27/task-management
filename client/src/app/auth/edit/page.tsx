import Loading from '@/components/elements/loading';
import AuthService from '@/services/auth.service';
import { redirect, RedirectType } from 'next/navigation';
import { Suspense } from 'react';
import { default as EditProfile } from './form';

export default async function Signup({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const success = await AuthService.isUserAuthenticated();

	if (!success) {
		const redirectUrl = (searchParams['callback'] as string) ?? '/auth/login';
		redirect(redirectUrl, RedirectType.replace);
	}

	const { account } = await AuthService.details();

	return (
		<Suspense fallback={<Loading />}>
			<EditProfile
				accountDetails={{
					firstName: account.name.split(' ')[0],
					lastName: account.name.split(' ')[1] ?? '',
					email: account.email,
					phone: account.phone,
				}}
			/>
		</Suspense>
	);
}
