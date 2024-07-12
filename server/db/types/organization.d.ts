import { Document, Types } from 'mongoose';

export default interface IOrganization extends Document {
	_id: Types.ObjectId;
	name: string;
	industry: string;
	domain?: string;
	logo: string;
	address: {
		street: string;
		city: string;
		state: string;
		zip: string;
		country: string;
	};
	timezone: string;

	owner: Types.ObjectId;
}
