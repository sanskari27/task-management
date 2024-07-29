'use client';
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from '../ui/menubar';
import { ThemeToggle } from '../ui/theme-toggle';
import { LogoutButton } from './logout-button';

export default function AdminNavbar() {
	// const pathname = usePathname();
	// const org_id = pathname.split('/')[2];
	const now = new Date();
	const start_date = new Date(now);
	const end_date = new Date(now);
	start_date.setHours(0, 0, 0, 0);
	end_date.setHours(23, 59, 59, 999);

	// useEffect(() => {
	// 	function handleKeyDown(e: KeyboardEvent) {
	// 		if (e.key === 'l' && e.metaKey) {
	// 			e.preventDefault();
	// 			window.location.href = '/organizations';
	// 		}
	// 		if (e.key === 'k' && e.metaKey) {
	// 			e.preventDefault();
	// 			window.location.href = `/organizations/${org_id}/tasks/create`;
	// 		}
	// 		if (e.key === 'j' && e.metaKey) {
	// 			e.preventDefault();
	// 			window.location.href = `/organizations/${org_id}/tasks/my-tasks`;
	// 		}
	// 	}

	// 	document.addEventListener('keydown', handleKeyDown);

	// 	return () => {
	// 		document.removeEventListener('keydown', handleKeyDown);
	// 	};
	// }, [org_id]);

	return (
		<Menubar className=' backdrop-blur-sm px-[2%] md:px-[7%] py-4 border-t-0 border-x-0 border-b'>
			<Link href='/admin' className='text-sm font-medium text-zinc-600 dark:text-zinc-300 py-1.5'>Dashboard</Link>
			<MenubarMenu>
				<MenubarTrigger>Organization</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href='/organizations'>
							Your Organizations <MenubarShortcut>⌘L</MenubarShortcut>
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Link href={`/admin/organizations`}>All Organizations</Link>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Employees</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href={`/admin/organizations/employees`}>All Employees</Link>
					</MenubarItem>
					{/* <MenubarItem>
						<Link href={`/organizations/${org_id}/employees/manage`}>Restructure Members</Link>
					</MenubarItem> */}
					{/* <MenubarSeparator />
							<MenubarItem>
								<Link href={`/organizations/${org_id}/employees?invite=true`}>Invite Members</Link>
							</MenubarItem>
							<MenubarItem>
								<Link href={`/organizations/${org_id}/employees?remove=true`}>Remove Members</Link>
							</MenubarItem> */}
				</MenubarContent>
			</MenubarMenu>

			<div className='flex-1' />
			<MenubarMenu>
				<MenubarTrigger>
					<Avatar className='w-8 h-8 '>
						<AvatarImage src='/profile.png' alt='settings' />
						<AvatarFallback>P</AvatarFallback>
					</Avatar>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href={`/profile/edit`}>
							<div className='inline-flex justify-start items-center gap-2'>
								<CircleUserRound size={'1.2rem'} />
								Profile Details
							</div>
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<ThemeToggle />
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<LogoutButton />
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}
