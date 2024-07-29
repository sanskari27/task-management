import { EmployeeDB, IEmployee } from '@/db';
import { AUTH_ERRORS, COMMON_ERRORS, CustomError } from '@/errors';
import { IDType } from '@/types';
import { filterUndefinedKeys, mongoArrayIncludes } from '@/utils/ExpressUtils';
import OrganizationService from './organization';
import UserService from './user';

export default class EmployeeService {
	private _e_id: IDType;
	private _u_id: IDType;
	private _o_id: IDType;
	private _parent?: IDType;
	private _can_create_others: boolean;
	private _can_let_others_create: boolean;

	public constructor(employee: IEmployee) {
		this._o_id = employee.organization;
		this._e_id = employee._id;
		this._parent = employee.parent;
		this._u_id = employee.account_id;
		this._can_create_others = employee.can_create_others;
		this._can_let_others_create = employee.can_let_others_create;
	}

	static async getEmployeeService(org_id: IDType, a_id: IDType) {
		const employee = await EmployeeDB.findOne({
			organization: org_id,
			account_id: a_id,
		});
		if (!employee) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return new EmployeeService(employee);
	}

	static async getServiceByID(e_id: IDType) {
		const employee = await EmployeeDB.findById(e_id);
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
		const user = await UserService.getUserService(data.account_id);

		const emp = await EmployeeDB.create({
			organization: _o_id,
			account_id: data.account_id,
			parent: data.parent,
			can_create_others: data.can_create_others ?? false,
			can_let_others_create: data.can_let_others_create ?? false,
			...user.getDetails(),
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

		if (!mongoArrayIncludes(managedEmployees, parent)) {
			throw new CustomError(AUTH_ERRORS.PERMISSION_DENIED);
		}

		try {
			const service = await EmployeeService.createEmployee(this._o_id, {
				account_id,
				parent,
				can_create_others: opts.can_create_others,
				can_let_others_create: opts.can_let_others_create,
			});

			return service;
		} catch (e) {
			throw new CustomError(COMMON_ERRORS.ALREADY_EXISTS);
		}
	}

	async getOrganizationService() {
		return await OrganizationService.getInstance(this._o_id);
	}

	async allEmployeesInOrganization() {
		const org = await this.getOrganizationService();
		return await org.getEmployees();
	}

	async removeFromOrganization(emp_id: IDType) {
		const managedEmployees = await EmployeeService.managedEmployees(this._e_id);

		if (!mongoArrayIncludes([...managedEmployees, this._e_id], emp_id)) {
			throw new CustomError(AUTH_ERRORS.PERMISSION_DENIED);
		}

		const emp = await EmployeeDB.findOneAndDelete({
			organization: this._o_id,
			_id: emp_id,
		});

		if (!emp) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		for (const emp_id of managedEmployees) {
			this.reconfigurePosition({ emp_id, parent: emp.parent });
		}

		OrganizationService.deleteOrganizationByOwnerID(this._o_id, emp_id);
	}

	async updatePermissions(
		emp_id: IDType,
		data: {
			can_create_others?: boolean;
			can_let_others_create?: boolean;
		}
	) {
		const managedEmployees = await EmployeeService.managedEmployees(this._e_id);

		if (!mongoArrayIncludes(managedEmployees, emp_id)) {
			throw new CustomError(AUTH_ERRORS.PERMISSION_DENIED);
		}

		await EmployeeDB.updateOne(
			{
				organization: this._o_id,
				_id: emp_id,
			},
			filterUndefinedKeys(data)
		);
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

	async getDetails() {
		const user = await UserService.getUserService(this._u_id);
		const details = user.getDetails();
		return {
			employee_id: this._e_id,
			organization_id: this._o_id,
			parent_id: this._parent,
			can_create_others: this._can_create_others,
			can_let_others_create: this._can_let_others_create,
			...details,
		};
	}

	async managedEmployees() {
		return await EmployeeService.managedEmployees(this._e_id);
	}

	static async getInstancesOfUser(user_id: IDType) {
		const employees = await EmployeeDB.find({
			account_id: user_id,
		});

		return employees.map((emp) => new EmployeeService(emp));
	}

	static async managedEmployees(emp_id: IDType) {
		const employees = await EmployeeDB.find({
			parent: emp_id,
		});
		const employees_id = employees.map((emp) => emp._id);

		for (const emp of employees) {
			const sub_employees = await EmployeeService.managedEmployees(emp._id);
			employees_id.push(...sub_employees);
		}

		return employees_id;
	}
}
