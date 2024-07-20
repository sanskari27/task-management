export type TEmployee = {
	id: string;
	name: string;
	email: string;
	phone: string;
	can_create_others: boolean;
	can_let_others_create: boolean;
	parent_id?: string;
	children?: TEmployee[];
};
