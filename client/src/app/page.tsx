import { LOGO, TASKS, TASKS_MOBILE } from '@/assets/image';
import { GridBackground } from '@/components/ui/background-grid';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { FlipWords } from '@/components/ui/flip-words';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { LampContainer } from '@/components/ui/lamp';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FeaturesSectionDemo } from '../components/elements/feature-section';
import { SparklesPreview } from '../components/ui/sparkles-text';

export const metadata: Metadata = {
	title: 'Task Management @ Wautopilot',
};

export default function Home() {
	return (
		<main className='flex min-h-screen w-screen flex-col items-center justify-between bg-slate-950'>
			<LampContainer className='md:mt-[7%]'>
				<div className='text-4xl md:text-6xl font-bold w-full text-center mt-12 pb-2'>
					Simplify
					<FlipWords words={['Tasks', 'Projects', 'Success']} />
				</div>
				<SparklesPreview text='With Wautopilot Tasks' />

				<div className='text-lg mt-[2rem] w-1/2 max-w-screen-lg text-center font-medium text-neutral-100'>
					From building an agile task board for a project to organizing your daily to-do lists,
					Tasks is the perfect tool to manage work items, stay focused on what matters, and
					consistently meet your goals on time.
				</div>
				<Link href={'/auth/login'} className='mt-4'>
					<HoverBorderGradient>Signup for free</HoverBorderGradient>
				</Link>
			</LampContainer>
			<GridBackground>
				<ContainerScroll
					titleComponent={
						<>
							<h1 className='text-4xl font-semibold text-black dark:text-white'>
								Stay organized for <br />
								<span className='text-4xl md:text-[6rem] font-bold mt-1 leading-none'>
									Better productivity
								</span>
							</h1>
						</>
					}
				>
					<Image src={TASKS} alt='Tasks' className='w-full hidden md:block' />
					<Image src={TASKS_MOBILE} alt='Tasks_mobile' className='w-full md:hidden block' />
				</ContainerScroll>
				<FeaturesSectionDemo />
			</GridBackground>
			<footer className='bg-oil-black w-full text-white border-t-2 border-zinc-500'>
				<div className='pt-16 pb-4 px-[4%]'>
					<div className='flex flex-col md:flex-row text-center md:text-left gap-12 md:gap-8'>
						<div className='w-full md:w-1/3'>
							<div className='flex flex-col items-center md:items-start'>
								<div className='flex items-end justify-center md:justify-start gap-3'>
									<Image src={LOGO} alt='Logo' width={80} height={80} />
								</div>
								<div className='w-full md:w-[500px] pt-4 mx-auto md:mx-0 '>
									<p>
										A product from
										<Link className='ml-1' href='https://wautopilot.com/'>
											Wautopilot
										</Link>
									</p>
									<p className='pt-2'>Made with 🤍 in India</p>
								</div>
							</div>
						</div>
						<div className='w-full md:w-1/3 flex flex-col ml-auto text-center md:text-right gap-0'>
							<span className='underline underline-offset-8 font-medium'>Get in touch</span>
							<p className='mt-2'>Stellar Coaching & Consulting</p>
							<p>B-502, Sahara Apartment, Plot No. 11,</p>
							<p>Sector 6 Dwarka, Dwarka,</p>
							<p>New Delhi, Delhi 110075, India</p>
						</div>
					</div>
					<div className='flex flex-col md:flex-row items-center justify-center mt-8'>
						<p className='px-4 text-center'>© 2024 Wautopilot, All rights reserved.</p>
					</div>
				</div>
			</footer>
		</main>
	);
}
