import { Loader2 } from 'lucide-react';

export default function Loading() {
	return (
		<div className='w-screen h-screen absolute left-0 top-0 right-0 bottom-0 flex justify-center items-center  backdrop-blur-sm z-[9999]' onClick={(e)=>e.stopPropagation()}>
			<div className='p-4 bg-black/40 rounded-full'>
				<Loader2 className='h-6 w-6 animate-spin' />
			</div>
		</div>
	);
}
