import { Suspense } from 'react';
import { ResetPassword } from './form';

export default function ResetPasswordWrapper() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ResetPassword />
		</Suspense>
	);
}
