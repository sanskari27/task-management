'use client';
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
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

export default function Navbar({ org_id }: { org_id: string }) {
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'l' && e.metaKey) {
				e.preventDefault();
				window.location.href = '/organizations';
			}
			if (e.key === 'k' && e.metaKey) {
				e.preventDefault();
				window.location.href = `/organizations/${org_id}/tasks/create`;
			}
			if (e.key === 'j' && e.metaKey) {
				e.preventDefault();
				window.location.href = `/organizations/${org_id}/tasks/my-tasks`;
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [org_id]);

	return (
		<Menubar className=' backdrop-blur-sm px-[2%] md:px-[7%] py-4 border-t-0 border-x-0 border-b'>
			<MenubarMenu>
				<MenubarTrigger>Organization</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href='/organizations'>
							Switch Organization <MenubarShortcut>⌘L</MenubarShortcut>
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Link href={`/organizations/${org_id}/edit`}>Organization Details</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${org_id}/edit?manage_categories=true`}>
							Manage Categories
						</Link>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Memebers</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href={`/organizations/${org_id}/employees`}>Members</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${org_id}/employees/manage`}>Restructure Members</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Link href={`/organizations/${org_id}/employees?invite=true`}>Invite Members</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${org_id}/employees??remove=true`}>Remove Members</Link>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Tasks</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href={`/organizations/${org_id}/tasks/create`}>
							Assign Task <MenubarShortcut>⌘K</MenubarShortcut>
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Link href={`/organizations/${org_id}/tasks/my-tasks`}>
							My Tasks <MenubarShortcut>⌘J</MenubarShortcut>
						</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${org_id}/tasks/delegated-tasks`}>Delegated Tasks</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${org_id}/tasks`}>All Task</Link>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<div className='flex-1' />
			<MenubarMenu>
				<MenubarTrigger>
					<Avatar>
						<AvatarImage src='/profile.png' alt='settings' />
						<AvatarFallback>P</AvatarFallback>
					</Avatar>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href={`/organizations/${org_id}/tasks/delegated-tasks`}>
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
