import { TASKS, TASKS_MOBILE } from '@/assets/image';
import { GridBackground } from '@/components/ui/background-grid';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { FlipWords } from '@/components/ui/flip-words';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { LampContainer } from '@/components/ui/lamp';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FeaturesSectionDemo } from './feature-section';
import Footer from './footer';
import { SparklesPreview } from './sparkles-text';

export const metadata: Metadata = {
	title: 'Task Management @ Wautopilot',
};

export default function Home() {
	return (
		<main className='flex min-h-screen w-screen flex-col items-center justify-between '>
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
			<Footer />
		</main>
	);
}
