import { Document, Types } from 'mongoose';

export default interface IEmployee extends Document {
	_id: Types.ObjectId;
	organization: Types.ObjectId;
	parent?: Types.ObjectId;
	account_id: Types.ObjectId;
	disabled: boolean;

	can_create_others: boolean;
	can_let_others_create: boolean;
}
