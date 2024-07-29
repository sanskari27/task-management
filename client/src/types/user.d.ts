export type IUsers = {
	account: {
		email: string;
		name: string;
		phone: string;
	};
	organizations: {
		org_id: string;
		name: string;
		logo: string;
		is_owner: boolean;
	}[];
};
