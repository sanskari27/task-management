import Loading from '@/components/elements/loading';
import AuthService from '@/services/auth.service';
import { Suspense } from 'react';
import { default as EditProfile } from './form';

export default async function EditProfilePage() {
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
