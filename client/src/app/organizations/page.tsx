import Centered from '@/components/containers/centered';
import Each from '@/components/containers/each';
import PageLayout from '@/components/containers/page-layout';
import Show from '@/components/containers/show';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { LinkPreview } from '@/components/ui/link-preview';
import AuthService from '@/services/auth.service';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Organizations() {
	const success = await AuthService.isUserAuthenticated();

	if (!success) {
		redirect('/auth/login?callback=/organizations');
	}
	const details = await AuthService.details();

	return (
		<PageLayout className='lg:w-3/4 mx-auto w-full p-3 mt-[3rem]'>
			<div className='flex flex-col text-center lg:text-left gap-4 lg:flex-row justify-between items-center'>
				<div>
					<p className='text-xl font-extrabold tracking-tight lg:text-3xl'>
						Hello {details?.account.name ?? 'there'},
					</p>
					<p className='text-md tracking-tight lg:text-lg'>Here are the list of organizations</p>
				</div>
				<Link href='/organizations/create'>
					<Button>Create own organization</Button>
				</Link>
			</div>
			<div className='py-4 grid gap-4'>
				<Show>
					<Show.When condition={details.organizations.length === 0}>
						<Centered className='flex-col h-[50vh] '>
							<p className='text-center mt-6 font-semibold text-3xl'>
								Oops, You are not part of any organization.
							</p>
							<p className='text-center'>Create your organization and Get Started</p>
						</Centered>
					</Show.When>
					<Show.Else>
						<Each
							items={details.organizations}
							render={(org) => (
								<Card className='pt-8'>
									<CardContent>
										<div className='flex items-center space-x-4 rounded-md'>
											<div className='h-[48px] md:h-[60px] w-[48px] md:w-[60px]  text-center'>
												<Avatar className='inline-flex justify-center  items-center h-full w-full '>
													<AvatarImage
														className='h-full w-full rounded-full border-gray-50 border'
														src={`${process.env.NEXT_PUBLIC_API_URL}media/${org.logo}`}
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
											<div className='flex-1 flex-col gap-6'>
												<CardTitle>{org.name}</CardTitle>

												<div className='flex flex-col md:flex-row md:items-center gap-x-3 mt-2'>
													<LinkPreview
														url={org.domain}
														className='font-medium md:font-semibold text-sm md:text-base bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500'
													>
														{org.domain}
													</LinkPreview>
													<span className='h-[6px] w-[6px] rounded-full bg-gray-300 dark:bg-gray-400 hidden md:block'></span>
													<p className='text-sm text-muted-foreground'>{org.industry}</p>
												</div>
											</div>
											<Link href={`/organizations/${org.org_id}`}>
												<Button variant={'outline'}>Manage</Button>
											</Link>
										</div>
									</CardContent>
								</Card>
							)}
						/>
					</Show.Else>
				</Show>
			</div>
		</PageLayout>
	);
}
