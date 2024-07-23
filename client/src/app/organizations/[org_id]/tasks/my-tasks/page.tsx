import { SearchBar } from '@/components/ui/searchbar';

export default async function MyTasks() {
	// const tasks = await TasksService.getAllTasks(organizationId);

	function handleSearch(text: string) {
		console.log(text);
	}
	return (
		<section className='mx-[2%] md:mx-[7%] mt-3'>
			<div className='flex items-center justify-between'>
				<h2 className='text-3xl font-bold'>My Tasks</h2>
				<div className='min-w-[50%]'>
					<SearchBar
						placeholders={[
							'Search by task name',
							'Search by task description',
							'Search by task category',
						]}
						// onSubmit={handleSearch}
					/>
				</div>
			</div>
		</section>
	);
}
