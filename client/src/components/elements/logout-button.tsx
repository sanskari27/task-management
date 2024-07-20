'use client';

import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AuthService from '@/services/auth.service';

export function LogoutButton() {
	async function handleClick() {
		const success = await AuthService.logout();
		if (success) {
			window.location.href = '/';
		}
	}

	return (
		<Button variant='ghost' onClick={handleClick}>
			<LogOut className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all  mr-2' />
			<span>Logout</span>
		</Button>
	);
}
