'use client';
import { trefoil } from 'ldrs';

export default function Loading() {
	trefoil.register();
	return (
		<div
			className='w-screen h-screen absolute left-0 top-0 right-0 bottom-0 flex justify-center items-center  backdrop-blur-sm z-[9999]'
			onClick={(e) => e.stopPropagation()}
		>
			<div className='p-4 rounded-full shadow-[inset_0px_0px_30px_30px_#00000040] dark:shadow-[inset_0px_0px_30px_30px_#FFFFFF10]'>
				<l-trefoil
					size='55'
					stroke='4'
					stroke-length='0.15'
					bg-opacity='0.1'
					speed='1.2'
					color='white'
				></l-trefoil>
			</div>
		</div>
	);
}
