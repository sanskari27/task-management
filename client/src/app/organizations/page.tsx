import PageLayout from '@/components/containers/page-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkPreview } from '@/components/ui/link-preview';
import AuthService from '@/services/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Link from 'next/link';

export default async function Dashboard() {
	const details = await AuthService.details();

	return (
		<PageLayout className='lg:w-3/4 mx-auto w-full p-3 mt-[3rem]'>
			<div className='flex flex-col text-center lg:text-left gap-4 lg:flex-row justify-between items-center'>
				<div>
					<p className='text-xl font-extrabold tracking-tight lg:text-3xl'>
						Hello {details?.account.name},
					</p>
					<p className='text-md tracking-tight lg:text-lg'>Here are the list of organizations</p>
				</div>
				<Link href='/organizations/create'>
					<Button>Create own organization</Button>
				</Link>
			</div>
			<div className='py-4 grid gap-4'>
				{details.organizations.map((org) => (
					<Card key={org.org_id} className=''>
						<CardHeader>
							<CardTitle>{org.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='flex items-center space-x-4 rounded-md'>
								<div className='h-[60px] w-[60px]  text-center'>
									<Avatar className='inline-flex justify-center  items-center h-full w-full '>
										<AvatarImage
											className='h-full w-full rounded-full'
											src={`${process.env.NEXT_PUBLIC_API_URL}/media/${org.logo}`}
										/>
										<AvatarFallback className='rounded-full border inline-flex justify-center items-center h-full w-full '>
											{org.name
												.split(' ')
												.map((name) => name.charAt(0))
												.join('')
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className='flex-1 flex-col justify-between'>
									<LinkPreview
										url={org.domain}
										className='font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500'
									>
										{org.domain}
									</LinkPreview>
									<p className='text-sm text-muted-foreground'>{org.industry}</p>
								</div>
								<Link href={`/organizations/${org.org_id}`}>
									<Button variant={'outline'}>Manage</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</PageLayout>
	);
}
