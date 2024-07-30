// components/Footer.js
import { LOGO } from '@/assets/image';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
	return (
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
	);
};

export default Footer;
