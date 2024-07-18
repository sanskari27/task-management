'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import Each from '../containers/each';

export default function ComboboxEmployee({
	placeholder,
	items,
	value,
	onChange,
}: {
	placeholder: string;
	items: {
		employee_id: string;
		organization_id: string;
		can_create_others: boolean;
		can_let_others_create: boolean;
		name: string;
		email: string;
		phone: string;
	}[];
	value: string[];
	onChange: (value: string[]) => void;
}) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-full justify-between'
				>
					{value.length > 0 ? `${value.length} selected` : placeholder}
					<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-full p-0'>
				<Command>
					<CommandInput placeholder='Search Employee...' />
					<CommandEmpty>No employee found.</CommandEmpty>
					<CommandList>
						<CommandGroup>
							<Each
								items={items}
								render={(item) => (
									<CommandItem
										key={item.employee_id}
										value={item.name}
										onSelect={(currentValue) => {
											if (value.includes(currentValue)) {
												onChange(value.filter((v) => v !== currentValue));
											} else {
												onChange([...value, currentValue]);
											}
										}}
										className={cn('cursor-pointer z-10')}
										onClick={() => console.log('clicked')}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												value.includes(item.name) ? 'opacity-100' : 'opacity-0'
											)}
										/>
										{item.name}
									</CommandItem>
								)}
							/>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
