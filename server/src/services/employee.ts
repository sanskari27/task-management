import { getOrCache, removeFromCache } from '@/config/cache';
import { EmployeeDB, IEmployee } from '@/db';
import { AUTH_ERRORS, COMMON_ERRORS, CustomError } from '@/errors';
import { IDType } from '@/types';
import { filterUndefinedKeys } from '@/utils/ExpressUtils';
import UserService from './user';

export default class EmployeeService {
	private _e_id: IDType;
	private _u_id: IDType;
	private _o_id: IDType;
	private _parent?: IDType;
	private _disabled: boolean;
	private _can_create_others: boolean;
	private _can_let_others_create: boolean;

	public constructor(employee: IEmployee) {
		this._o_id = employee.organization;
		this._e_id = employee._id;
		this._parent = employee.parent;
		this._u_id = employee.account_id;
		this._disabled = employee.disabled;
		this._can_create_others = employee.can_create_others;
		this._can_let_others_create = employee.can_let_others_create;
	}

	static async getEmployeeService(org_id: IDType, user_id: IDType) {
		const employee = await EmployeeDB.findOne({
			organization: org_id,
			account_id: user_id,
		});
		if (!employee) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return new EmployeeService(employee);
	}

	static async createEmployee(
		_o_id: IDType,
		data: {
			account_id: IDType;
			parent?: IDType;
			can_create_others?: boolean;
			can_let_others_create?: boolean;
		}
	) {
		const emp = await EmployeeDB.create({
			organization: _o_id,
			account_id: data.account_id,
			parent: data.parent,
			can_create_others: data.can_create_others ?? false,
			can_let_others_create: data.can_let_others_create ?? false,
		});

		return new EmployeeService(emp);
	}

	async invite(
		account_id: IDType,
		opts: {
			parent?: IDType;
			can_create_others?: boolean;
			can_let_others_create?: boolean;
		}
	) {
		if (!this.can_create_others || (!this.can_let_others_create && opts.can_create_others)) {
			throw new CustomError(AUTH_ERRORS.PERMISSION_DENIED);
		}

		const parent = opts.parent || this._e_id;

		const managedEmployees = await EmployeeService.managedEmployees(this._e_id);
		managedEmployees.push(this._e_id);

		if (!managedEmployees.includes(account_id) || !managedEmployees.includes(parent)) {
			throw new CustomError(AUTH_ERRORS.PERMISSION_DENIED);
		}

		const service = await EmployeeService.createEmployee(this._o_id, {
			account_id,
			parent,
			can_create_others: opts.can_create_others,
			can_let_others_create: opts.can_let_others_create,
		});

		removeFromCache(`managed_employees_${this._e_id}`);

		return service;
	}

	async getUserService() {
		return await UserService.getUserService(this._u_id);
	}

	get employee_id() {
		return this._e_id;
	}

	get organization_id() {
		return this._o_id;
	}

	get parent_id() {
		return this._parent;
	}

	get disabled() {
		return this._disabled;
	}

	get can_create_others() {
		return this._can_create_others;
	}

	get can_let_others_create() {
		return this._can_let_others_create;
	}

	async updateDetails(opts: {
		parent?: IDType;
		disabled?: boolean;
		can_create_others?: boolean;
		can_let_others_create?: boolean;
	}) {
		const update: any = filterUndefinedKeys(opts);

		await EmployeeDB.updateOne(
			{
				_id: this._e_id,
			},
			update
		);

		this._parent = update.parent ?? this._parent;
		this._disabled = update.disabled ?? this._disabled;
		this._can_create_others = update.can_create_others ?? this._can_create_others;
		this._can_let_others_create = update.can_let_others_create ?? this._can_let_others_create;
	}

	async removeEmployee() {
		await EmployeeDB.deleteOne({
			organization: this._o_id,
			_id: this._e_id,
		});
	}

	async reconfigurePosition(data: { emp_id: IDType; parent?: IDType }) {
		await EmployeeDB.updateOne(
			{
				_id: data.emp_id,
			},
			{
				parent: data.parent,
			}
		);
	}

	static async managedEmployees(emp_id: IDType) {
		return getOrCache(`managed_employees_${emp_id}`, async () => {
			const employees = await EmployeeDB.find({
				parent: emp_id,
			});
			const employees_id = employees.map((emp) => emp._id);

			for (const emp of employees) {
				const sub_employees = await EmployeeService.managedEmployees(emp._id);
				employees_id.push(...sub_employees);
			}

			return employees_id;
		});
	}
}
