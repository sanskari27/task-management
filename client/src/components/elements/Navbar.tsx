import Link from 'next/link';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from '../ui/navigation-menu';
import { ThemeToggle } from '../ui/theme-toggle';
import ListItem from './ListItem';
import { LogoutButton } from './logout-button';

export default function Navbar({ params }: { params: string }) {
	return (
		<NavigationMenu className='mx-2 md:mx-[1rem] sticky top-1 max-w-screen justify-between backdrop-blur-sm bg-transparent  px-2 py-4 md:p-[1rem] justify-self-center flex-col md:flex-row '>
			<div className='flex items-center'>
				<Link
					href='/organizations'
					className='p-[0.5rem] dark:hover:bg-zinc-800 hover:bg-slate-100 rounded-lg'
				>
					Switch Organization
				</Link>
				<div className='md:hidden block border-l border-gray-400 ml-2 pl-2'>
					<ThemeToggle />
					<LogoutButton />
				</div>
			</div>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Organizations</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid w-[400px] gap-x-1.5 gap-y-0.5 p-4 md:w-[450px] md:grid-cols-2 '>
							<ListItem href={`/organizations/${params}/edit`} title='Organization Details' />
							<ListItem href={`/organizations/${params}/employees/manage`} title='Manage Members' />
							<ListItem href={`/organizations/${params}/employees`} title='Members Data' />
							<ListItem
								href={`/organizations/${params}/employees?invite=true`}
								title='Invite Member'
							/>
							<div />
							<ListItem
								href={`/organizations/${params}/employees?remove=true`}
								title='Remove Member'
							/>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<Link
					href={`/organizations/${params}/tasks/create`}
					className='py-[0.5rem] px-[1rem] dark:hover:bg-zinc-800 hover:bg-slate-100 rounded-lg text-center'
				>
					Assign Task
				</Link>
				<NavigationMenuItem>
					<NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
						Tasks
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid w-[400px] gap-x-1.5 gap-y-0.5 p-4 md:w-[500px] md:grid-cols-3 lg:w-[600px] '>
							<ListItem href={'/my-tasks'} title='My Tasks' className={'text-center'} />
							<ListItem
								href={'/delegated-tasks'}
								title='Delegated Tasks'
								className={'text-center'}
							/>
							<ListItem href={'/tasks'} title='All tasks' className={'text-center'} />
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
			<div className='hidden md:block'>
				<ThemeToggle />
				<LogoutButton />
			</div>
		</NavigationMenu>
	);
}
