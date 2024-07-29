'use client';

import {
	CaretSortIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DoubleArrowLeftIcon,
	DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import Show from '@/components/containers/show';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { LinkPreview } from '@/components/ui/link-preview';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { TOrganization } from '@/types/organizatios';
import Link from 'next/link';

export const columns: ColumnDef<TOrganization>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<div className='inline-flex justify-center items-center w-3/4'>
				<Checkbox
					className='mx-auto'
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label='Select all'
				/>
			</div>
		),
		cell: ({ row }) => (
			<div
				className='cursor-pointer inline-flex justify-center items-center w-full'
				onClick={() => row.toggleSelected()}
			>
				<Show>
					<Show.When condition={!row.getIsSelected()}>
						<Avatar>
							<AvatarImage
								className='h-full w-full rounded-full border-gray-50 border'
								src={`${process.env.NEXT_PUBLIC_API_URL}media/${row.original.logo}`}
							/>
							<AvatarFallback>
								{(row.getValue('name') as string)
									.split(' ')
									.map((name) => name.charAt(0))
									.join('')
									.toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Show.When>
					<Show.Else>
						<div className='flex items-center justify-center dark:bg-gray-200 dark:text-black bg-gray-600 text-white rounded-full w-10 h-10'>
							{(row.getValue('name') as string)
								.split(' ')
								.map((name) => name.charAt(0))
								.join('')
								.toUpperCase()}
						</div>
					</Show.Else>
				</Show>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => <div className='text-left'>{row.getValue('name')}</div>,
	},
	{
		accessorKey: 'owner',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Owner
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='text-left'>{(row.getValue('owner') as { name: string }).name}</div>
		),
	},
	{
		accessorKey: 'industry',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Industry
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => <div className='text-left'>{row.getValue('industry')}</div>,
	},
	{
		accessorKey: 'domain',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Domain
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => (
			<div className='text-left'>
				<LinkPreview url={row.getValue('domain')}>{row.getValue('domain')}</LinkPreview>
			</div>
		),
	},
	{
		accessorKey: 'timezone',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Timezone
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => <div className='text-left'>{row.getValue('timezone')}</div>,
	},
	{
		accessorKey: 'total_employees',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Employees
					<CaretSortIcon className='ml-2 h-4 w-4' />
				</Button>
			);
		},
		cell: ({ row }) => <div className='text-center'>{row.getValue('total_employees')}</div>,
	},
	{
		accessorKey: 'id',
		header: () => {
			return <div className='text-center'>Action</div>;
		},
		cell: ({ row }) => (
			<Link className='mx-auto' href={`/admin/organizations/${row.getValue('id')}`}>
				<Button className='mx-auto' variant={'outline'}>
					Browse
				</Button>
			</Link>
		),
	},
];

export function OrganizationTable({ data }: { data: TOrganization[] }) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className='w-full'>
			<div className='flex flex-col-reverse md:flex-row  md:items-center py-4 gap-1.5'>
				<div className='flex flex-col md:flex-row md:items-center gap-1.5 md:gap-3'>
					<Input
						placeholder='Filter name...'
						value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
						onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
						className='min-w-[250px]'
					/>
					<Input
						placeholder='Filter industry...'
						value={(table.getColumn('industry')?.getFilterValue() as string) ?? ''}
						onChange={(event) => table.getColumn('industry')?.setFilterValue(event.target.value)}
						className='min-w-[250px]'
					/>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' className='ml-auto'>
							Columns <ChevronDownIcon className='ml-2 h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => {
								return (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
									>
										{column.id.split('_').join(' ')}
									</DropdownMenuCheckboxItem>
								);
							})}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell className='text-center' key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className='h-24 text-center'>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-between px-2 mt-3'>
				<div className='flex-1 text-sm text-muted-foreground'>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className='flex items-center space-x-6 lg:space-x-8'>
					<div className='flex items-center space-x-2'>
						<p className='text-sm font-medium'>Rows per page</p>
						<Select
							value={`${table.getState().pagination.pageSize}`}
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger className='h-8 w-[70px] text-black dark:text-white'>
								<SelectValue placeholder={table.getState().pagination.pageSize} />
							</SelectTrigger>
							<SelectContent side='top'>
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className='flex w-[100px] items-center justify-center text-sm font-medium'>
						Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
					</div>
					<div className='flex items-center space-x-2'>
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to first page</span>
							<DoubleArrowLeftIcon className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							className='h-8 w-8 p-0'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className='sr-only'>Go to previous page</span>
							<ChevronLeftIcon className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							className='h-8 w-8 p-0'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to next page</span>
							<ChevronRightIcon className='h-4 w-4' />
						</Button>
						<Button
							variant='outline'
							className='hidden h-8 w-8 p-0 lg:flex'
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className='sr-only'>Go to last page</span>
							<DoubleArrowRightIcon className='h-4 w-4' />
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
