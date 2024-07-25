import Each from '@/components/containers/each';
import Show from '@/components/containers/show';
import AudioPlayer from '@/components/elements/audio-player';
import ProfileHover from '@/components/elements/profile-hover';
import { Badge } from '@/components/ui/badge';
import { LinkPreview } from '@/components/ui/link-preview';
import { Separator } from '@/components/ui/separator';
import TasksService from '@/services/tasks.service';
import {
	AlarmClock,
	AudioLines,
	CircleUserRound,
	File,
	FileImage,
	FileMinus,
	FileSpreadsheet,
	FileText,
	FileVideo,
	Flag,
	Hourglass,
	Presentation,
	Rss,
	Tag,
} from 'lucide-react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AddUpdate } from './add-update';
import { MarkCompleted, MarkInProgress, MarkPending } from './update-status';

export const metadata: Metadata = {
	title: 'Task Details',
};

export default async function TaskPage({
	params: { org_id, task_id },
}: {
	params: {
		org_id: string;
		task_id: string;
	};
}) {
	const task = await TasksService.getTaskDetails(org_id, task_id);
	if (!task) {
		notFound();
	}

	const { details, updates } = task;

	return (
		<section className='mx-[5%] md:mx-[7%] mt-3'>
			<div className='flex flex-col md:flex-row  md:items-center md:justify-between gap-y-3'>
				<h2 className='text-3xl font-bold'>{details.title}</h2>
				<div className='flex items-end justify-end gap-3'>
					<AddUpdate org_id={org_id} task_id={task_id} />
					<Show>
						<Show.When condition={details.status === 'in_progress'}>
							<MarkPending org_id={org_id} task_id={task_id} />
							<MarkCompleted org_id={org_id} task_id={task_id} />
						</Show.When>
						<Show.When condition={details.status === 'pending' || details.status === 'completed'}>
							<MarkInProgress org_id={org_id} task_id={task_id} />
						</Show.When>
					</Show>
				</div>
			</div>
			<Show>
				<Show.When condition={details.isOverdue}>
					<Badge variant={'destructive'} className='w-fit'>
						Overdue
					</Badge>
				</Show.When>
			</Show>
			<div className='flex flex-col md:flex-row gap-3 mt-6'>
				<div className='flex-1'>
					<div className='flex-1 flex flex-col gap-3 border-r-0 border-b md:border-b-0 md:border-r border-dotted md:pr-3 md:pb-0 pb-3'>
						<div className='flex flex-col gap-1 border border-dashed p-4 w-full  rounded-xl'>
							<div className='flex'>
								<span className='font-medium w-[80px] md:w-[150px]'>Due Date</span>
								<span className='font-medium mx-3 md:mx-6'>:</span>
								<p className='inline-flex items-center gap-2 font-medium md:font-bold capitalize'>
									<AlarmClock size={16} strokeWidth={2.25} />
									{details.due_date}
								</p>
							</div>
							<div className='flex'>
								<span className='font-medium w-[80px] md:w-[150px]'>Time Diff</span>
								<span className='font-medium mx-3 md:mx-6'>:</span>
								<p className='inline-flex items-center gap-2 font-medium md:font-bold capitalize'>
									<Hourglass size={16} strokeWidth={2.25} />
									{details.relative_date}
								</p>
							</div>
							<div className='flex'>
								<span className='font-medium w-[80px] md:w-[150px]'>Category</span>
								<span className='font-medium mx-3 md:mx-6'>:</span>
								<p className='inline-flex items-center gap-2 font-medium md:font-bold capitalize'>
									<Tag size={16} strokeWidth={2.25} />
									{details.category}
								</p>
							</div>
							<div className='flex'>
								<span className='font-medium w-[80px] md:w-[150px]'>Priority</span>
								<span className='font-medium mx-3 md:mx-6'>:</span>
								<p className='inline-flex items-center gap-2 font-medium md:font-bold capitalize'>
									<Flag size={16} strokeWidth={2.25} />
									{details.priority}
								</p>
							</div>
							<div className='flex'>
								<span className='font-medium w-[80px] md:w-[150px]'>Status</span>
								<span className='font-medium mx-3 md:mx-6'>:</span>
								<p className='inline-flex items-center gap-2 font-medium md:font-bold capitalize'>
									<Rss size={16} strokeWidth={2.25} />
									{details.status.replace('_', ' ')}
								</p>
							</div>
						</div>
						<div className='flex flex-col gap-1 border border-dashed p-4 w-full  rounded-xl'>
							<div className='flex'>
								<span className='font-medium w-[110px] md:w-[150px]'>Assigned By</span>
								<span className='font-medium mx-3 md:mx-6'>:</span>
								<ProfileHover {...details.created_by}>
									<p className='inline-flex items-center gap-2 font-medium md:font-bold capitalize'>
										<CircleUserRound size={16} strokeWidth={2.25} />
										{details.created_by.name}
									</p>
								</ProfileHover>
							</div>
							<div className='flex'>
								<span className='font-medium w-[110px] md:w-[150px]'>Assigned To</span>
								<span className='font-medium mx-3 md:mx-6'>:</span>
								<ul>
									<Each
										items={details.assigned_to}
										render={(item) => (
											<li>
												<ProfileHover {...item}>
													<p className='inline-flex items-center gap-2 font-medium md:font-bold capitalize'>
														<CircleUserRound size={16} strokeWidth={2.25} />
														{item.name}
													</p>
												</ProfileHover>
											</li>
										)}
									/>
								</ul>
							</div>
						</div>
						<div className='border border-dashed p-4 w-full  rounded-xl'>
							<span className='font-semibold w-[80px] md:w-[150px] underline underline-offset-1'>
								Task Description
							</span>
							<p>{details.description}</p>
						</div>
						<div
							className='border border-dashed p-4 w-full  rounded-xl'
							hidden={details.links.length === 0}
						>
							<span className='font-semibold w-[80px] md:w-[150px] underline underline-offset-1'>
								Links
							</span>
							<ul>
								<Each
									items={details.links}
									render={(link) => (
										<li>
											<LinkPreview
												url={link}
												className='font-medium md:font-semibold text-sm md:text-base bg-clip-text text-transparent dark:text-transparent bg-gradient-to-br from-purple-500 to-pink-500 dark:from-lime-300 dark:to-emerald-300'
											>
												{link}
											</LinkPreview>
										</li>
									)}
								/>
							</ul>
						</div>
						<div
							className='border border-dashed p-4 w-full  rounded-xl'
							hidden={details.files.length === 0}
						>
							<span className='font-semibold w-[80px] md:w-[150px] underline underline-offset-1'>
								Files
							</span>
							<ul className='flex flex-col mt-2'>
								<Each
									items={details.files}
									render={(file, index) => (
										<li>
											<a
												href={`${process.env.NEXT_PUBLIC_API_URL}media/${file}`}
												target='_blank'
												rel='noreferrer'
												className='inline-flex gap-2 items-center line-clamp-1'
											>
												{getComponentByMimeType(file)}
												{`File ${index + 1}.${file.split('.').pop()}`}
											</a>
										</li>
									)}
								/>
							</ul>
						</div>
						<div
							className='border border-dashed p-4 w-full  rounded-xl'
							hidden={details.voice_notes.length === 0}
						>
							<span className='font-semibold w-[80px] md:w-[150px] underline underline-offset-1'>
								Voice Notes
							</span>
							<ul className='flex flex-col mt-2'>
								<Each
									items={details.voice_notes}
									render={(file, index) => (
										<li className='inline-flex gap-2 items-center'>
											<AudioPlayer src={`${process.env.NEXT_PUBLIC_API_URL}media/${file}`} />

											<AudioLines size={16} strokeWidth={2.25} />
											{`Voice Note ${index + 1}`}
										</li>
									)}
								/>
							</ul>
						</div>
					</div>
				</div>
				<div className='flex-1 flex flex-col gap-2  max-h-fit overflow-scroll'>
					<div className='flex justify-between items-end'>
						<h3 className='text-xl font-semibold'>Task Updates</h3>
						<span className='text-sm'>{updates.length} updates found</span>
					</div>
					<div className='flex flex-col gap-2 overflow-y-scroll'>
						<Each
							items={updates}
							render={(update) => (
								<div className='flex flex-col gap-2 border border-dashed p-4 w-full  rounded-xl'>
									<div className='flex'>
										<ProfileHover {...update.added_by}>
											<p className='inline-flex items-center gap-2 font-medium md:font-bold capitalize'>
												<CircleUserRound size={16} strokeWidth={2.25} />
												{update.added_by.name}
											</p>
										</ProfileHover>
									</div>
									<div>
										<p>{update.message}</p>
									</div>
									<div hidden={update.links.length === 0}>
										<Separator className='mb-2' />
										<span className='font-semibold w-[80px] md:w-[150px] underline underline-offset-1'>
											Links
										</span>
										<ul>
											<Each
												items={update.links}
												render={(link) => (
													<li>
														<LinkPreview
															url={link}
															className='font-medium md:font-semibold text-sm md:text-base bg-clip-text text-transparent dark:text-transparent bg-gradient-to-br from-purple-500 to-pink-500 dark:from-lime-300 dark:to-emerald-300'
														>
															{link}
														</LinkPreview>
													</li>
												)}
											/>
										</ul>
									</div>
									<div hidden={update.files.length === 0}>
										<Separator className='mb-2' />
										<span className='font-semibold w-[80px] md:w-[150px] underline underline-offset-1 '>
											Files
										</span>
										<ul className='flex flex-col mt-2'>
											<Each
												items={update.files}
												render={(file, index) => (
													<li>
														<a
															href={`${process.env.NEXT_PUBLIC_API_URL}media/${file}`}
															target='_blank'
															rel='noreferrer'
															className='inline-flex gap-2 items-center line-clamp-1'
														>
															{getComponentByMimeType(file)}
															{`File ${index + 1}.${file.split('.').pop()}`}
														</a>
													</li>
												)}
											/>
										</ul>
									</div>
									<div hidden={update.voice_notes.length === 0}>
										<Separator className='mb-2' />
										<span className='font-semibold w-[80px] md:w-[150px] underline underline-offset-1 '>
											Voice Notes
										</span>
										<ul className='flex flex-col mt-2'>
											<Each
												items={update.voice_notes}
												render={(file, index) => (
													<li className='inline-flex gap-2 items-center'>
														<AudioPlayer src={`${process.env.NEXT_PUBLIC_API_URL}media/${file}`} />

														<AudioLines size={16} strokeWidth={2.25} />
														{`Voice Note ${index + 1}`}
													</li>
												)}
											/>
										</ul>
									</div>
								</div>
							)}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}

function getComponentByMimeType(file: string) {
	const mimeType = file.split('.').pop();
	switch (mimeType) {
		case 'pdf':
			return <FileMinus size={16} strokeWidth={2.25} />;
		case 'doc':
		case 'docx':
			return <FileText size={16} strokeWidth={2.25} />;
		case 'xls':
		case 'xlsx':
			return <FileSpreadsheet size={16} strokeWidth={2.25} />;
		case 'ppt':
		case 'pptx':
			return <Presentation size={16} strokeWidth={2.25} />;
		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'gif':
			return <FileImage size={16} strokeWidth={2.25} />;
		case 'mp4':
		case 'avi':
		case 'mkv':
		case 'mov':
		case 'wmv':
			return <FileVideo size={16} strokeWidth={2.25} />;
		default:
			return <File size={16} strokeWidth={2.25} />;
	}
}
