'use client';
import { CircleUserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
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

export default function Navbar({ params }: { params: string }) {
	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'l' && e.metaKey) {
				e.preventDefault();
				window.location.href = '/organizations';
			}
			if (e.key === 'k' && e.metaKey) {
				e.preventDefault();
				window.location.href = `/organizations/${params}/tasks/create`;
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [params]);

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
						<Link href={`/organizations/${params}/edit`}>Organization Details</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Link href={`/organizations/${params}/employees`}>Members</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${params}/employees/manage`}>Restructure Members</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Link href={`/organizations/${params}/employees?invite=true`}>Invite Members</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${params}/employees??remove=true`}>Remove Members</Link>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>Tasks</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href={`/organizations/${params}/tasks/create`}>
							Assign Task <MenubarShortcut>⌘K</MenubarShortcut>
						</Link>
					</MenubarItem>
					<MenubarSeparator />
					<MenubarItem>
						<Link href={`/organizations/${params}/tasks/my-tasks`}>
							My Tasks <MenubarShortcut>⌘J</MenubarShortcut>
						</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${params}/tasks/delegated-tasks`}>Delegated Tasks</Link>
					</MenubarItem>
					<MenubarItem>
						<Link href={`/organizations/${params}/tasks`}>All Task</Link>
					</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<div className='flex-1' />
			<MenubarMenu>
				<MenubarTrigger>
					<Image
						src='/profile.png'
						width={40}
						height={40}
						className='rounded-full'
						alt='settings'
					/>
				</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						<Link href={`/organizations/${params}/tasks/delegated-tasks`}>
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

		// <NavigationMenu className='mx-2 md:mx-[1rem] sticky top-1 max-w-screen justify-between  bg-transparent backdrop-blur-sm px-2 py-4 md:p-[1rem] justify-self-center flex-col md:flex-row '>
		// 	<div className='flex items-center'>
		// 		<Link
		// 			href='/organizations'
		// 			className='p-[0.5rem] dark:hover:bg-zinc-800 hover:bg-slate-100 rounded-lg'
		// 		>
		// 			Switch Organization
		// 		</Link>
		// 		<div className='md:hidden block border-l border-gray-400 ml-2 pl-2'>
		// 			<ThemeToggle />
		// 			<LogoutButton />
		// 		</div>
		// 	</div>
		// 	<NavigationMenuList>
		// 		<NavigationMenuItem>
		// 			<NavigationMenuTrigger>Organizations</NavigationMenuTrigger>
		// 			<NavigationMenuContent>
		// 				<ul className='grid w-[400px] gap-x-1.5 gap-y-0.5 p-4 md:grid-cols-3 md:w-[500px]'>
		// 					<ListItem href={`/organizations/${params}/edit`} title='Details' />
		// 					<ListItem href={`/organizations/${params}/employees`} title='Members' />
		// 					<ListItem
		// 						href={`/organizations/${params}/employees?invite=true`}
		// 						title='Invite Member'
		// 					/>
		// 					<div />

		// 					<ListItem href={`/organizations/${params}/employees/manage`} title='Restructure' />
		// 					<ListItem
		// 						href={`/organizations/${params}/employees?remove=true`}
		// 						title='Remove Member'
		// 					/>
		// 				</ul>
		// 			</NavigationMenuContent>
		// 		</NavigationMenuItem>
		// 		<Link
		// 			href={`/organizations/${params}/tasks/create`}
		// 			className='py-[0.5rem] px-[1rem] dark:hover:bg-zinc-800 hover:bg-slate-100 rounded-lg text-center'
		// 		>
		// 			Assign Task
		// 		</Link>
		// 		<NavigationMenuItem>
		// 			<NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
		// 				Tasks
		// 			</NavigationMenuTrigger>
		// 			<NavigationMenuContent>
		// 				<ul className='grid w-[400px] gap-x-1.5 gap-y-0.5 p-4 md:w-[500px] md:grid-cols-3 '>
		// 					<ListItem
		// 						href={`/organizations/${params}/tasks/my-tasks`}
		// 						title='My Tasks'
		// 						className={'text-center'}
		// 					/>
		// 					<ListItem
		// 						href={`/organizations/${params}/tasks/delegated-tasks`}
		// 						title='Delegated Tasks'
		// 						className={'text-center'}
		// 					/>
		// 					<ListItem
		// 						href={`/organizations/${params}/tasks`}
		// 						title='All tasks'
		// 						className={'text-center'}
		// 					/>
		// 				</ul>
		// 			</NavigationMenuContent>
		// 		</NavigationMenuItem>
		// 	</NavigationMenuList>
		// 	<div className='hidden md:block'>
		// 		<ThemeToggle />
		// 		<LogoutButton />
		// 	</div>
		// </NavigationMenu>
	);
}
