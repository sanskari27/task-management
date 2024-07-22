'use client';

import React, { forwardRef, useImperativeHandle } from 'react';
import Each from '../containers/each';
import { Button } from '../ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

export type LinkInputHandle = {
	setLink(links: string[]): void;
};

type LinkInputProps = {
	children: React.ReactNode;
	onConfirm: (links: string[]) => void;
};

const LinkInputDialog = forwardRef<LinkInputHandle, LinkInputProps>(
	({ children, onConfirm }, ref) => {
		const [links, setLinks] = React.useState<string[]>([]);

		const buttonRef = React.useRef<HTMLButtonElement>(null);

		useImperativeHandle(ref, () => ({
			setLink: (links: string[]) => {
				setLinks(links);
			},
		}));

		const addBlankLink = () => {
			setLinks((prev) => [...prev, '']);
		};

		const removeLink = (index: number) => {
			setLinks((prev) => prev.filter((_, i) => i !== index));
		};

		const handleLinkChange = (index: number, value: string) => {
			setLinks((prev) => prev.map((link, i) => (i === index ? value : link)));
		};

		const handleConfirm = () => {
			console.log(links);
			onConfirm(links);
			handleClose();
		};

		const handleClose = () => {
			buttonRef.current?.click();
		};

		return (
			<Dialog>
				<DialogTrigger asChild ref={buttonRef}>
					{children}
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<div className='flex '>
							<div className='flex-1'>
								<DialogTitle>Add Link</DialogTitle>
								<DialogDescription>Enter the link details</DialogDescription>
							</div>
							<Button onClick={addBlankLink}>Add</Button>
						</div>
					</DialogHeader>
					<ScrollArea className='h-[400px] '>
						<Each
							items={links}
							render={(link, index) => {
								return (
									<>
										<div className='flex w-full gap-2'>
											<div className='flex-1'>
												<Input
													type='url'
													placeholder='Enter the link'
													value={link}
													onChange={(e) => handleLinkChange(index, e.target.value)}
												/>
											</div>
											<Button onClick={() => removeLink(index)} variant={'outline'}>
												X
											</Button>
										</div>
										<Separator className='my-2' />
									</>
								);
							}}
						/>
					</ScrollArea>
					<DialogFooter>
						<Button onClick={handleClose}>Cancel</Button>
						<Button onClick={handleConfirm}>Save</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}
);

LinkInputDialog.displayName = 'LinkInputDialog';

export default LinkInputDialog;
