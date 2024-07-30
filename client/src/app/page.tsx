import { TASKS, TASKS_MOBILE } from '@/assets/image';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import { FlipWords } from '@/components/ui/flip-words';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';
import { LampContainer } from '@/components/ui/lamp';
import Image from 'next/image';
import Link from 'next/link';
import { FeaturesSectionDemo } from './feature-section';

export default function Home() {
	return (
		<main className='flex min-h-screen w-screen flex-col items-center justify-between'>
			<LampContainer>
				<div className='text-3xl font-bold'>
					Simplify
					<FlipWords words={['Tasks', 'Projects', 'Success']} />
				</div>
				<div className='text-3xl'>With Wautopilot Tasks</div>

				<div className='text-lg mt-[2rem] max-w-screen-lg text-center font-medium'>
					From building an agile task board for a project to organizing your daily to-do lists,
					Tasks is the perfect tool to manage work items, stay focused on what matters, and
					consistently meet your goals on time.
				</div>
				<Link href={'/auth/login'} className='mt-4'>
					<HoverBorderGradient>Signup for free</HoverBorderGradient>
				</Link>
			</LampContainer>

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
		</main>
	);
}
