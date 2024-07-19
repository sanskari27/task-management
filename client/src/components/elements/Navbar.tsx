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

export default function Navbar({ params }: { params: string }) {
	return (
		<NavigationMenu className='mx-[1rem] sticky top-1 max-w-screen justify-between backdrop-blur-sm bg-transparent p-[1rem] justify-self-center'>
			<div></div>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Organizations</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid w-[400px] gap-1.5 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
							<ListItem href={`/organizations/${params}/edit`} title='Organization Details' />
							<ListItem href={`/organizations/${params}/employees`} title='Peoples' />
							<ListItem href={`/organizations/${params}/employees/manage`} title='Manage Employee' />
							<ListItem href={`/organizations/${params}/edit`} title='Invite Others' />
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
						Tasks
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
							<ListItem href={'/details'} title='Assigned to me' />
							<ListItem href={'/peo'} title='Assigned by' />
							<ListItem href={'/manage'} title='All tasks' />
							<ListItem href={`/organizations/${params}/tasks/create`} title='Create tasks' />
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
			<div>
				<ThemeToggle />
			</div>
		</NavigationMenu>
	);
}
