import { TEmployee } from '@/types/employee';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateOrganizationTree(employees: TEmployee[]) {
	if (employees.length === 0) return null;
	const idMap = new Map();
	const root: {
		name: string;
		attributes: any;
		children: any[];
	}[] = [];

	employees.forEach((item) => {
		const { id } = item;
		idMap.set(id.toString(), {
			name: item.name,
			attributes: {
				Email: item.email,
				Phone: item.phone,
				'Can Create Others': item.can_create_others ? 'Yes' : 'No',
				'Can Let Others Create': item.can_let_others_create ? 'Yes' : 'No',
			},
			children: [],
		});
	});

	employees.forEach((item) => {
		const { id, parent_id } = item;
		const node = idMap.get(id.toString());

		if (parent_id && idMap.has(parent_id.toString())) {
			idMap.get(parent_id.toString()).children.push(node);
		} else {
			root.push(node);
		}
	});

	if (root.length === 0) return null;

	return {
		name: root[0].name,
		attributes: root[0].attributes,
		children: root[0].children,
	};
}
