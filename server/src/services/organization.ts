import { EmployeeDB, IOrganization, OrganizationDB } from '@/db';
import { COMMON_ERRORS, CustomError } from '@/errors';
import { IDType } from '@/types';
import { filterUndefinedKeys } from '@/utils/ExpressUtils';
import EmployeeService from './employee';

type OrganizationData = {
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
	owner: IDType;
};

export default class OrganizationService {
	private _o_id: IDType;
	private _org: IOrganization;

	public constructor(org: IOrganization) {
		this._o_id = org._id;
		this._org = org;
	}

	static async getInstance(id: IDType) {
		const organization = await OrganizationDB.findById(id);
		if (!organization) {
			throw new CustomError(COMMON_ERRORS.NOT_FOUND);
		}

		return new OrganizationService(organization);
	}

	static async createOrganization(data: OrganizationData) {
		const organization = await OrganizationDB.create(data);
		return new OrganizationService(organization);
	}

	get org_id() {
		return this._o_id;
	}

	get organizationDetails() {
		return {
			name: this._org.name,
			industry: this._org.industry,
			domain: this._org.domain,
			logo: this._org.logo,
			address: this._org.address,
			timezone: this._org.timezone,
		};
	}

	async getEmployees(): Promise<EmployeeService[]> {
		const employees = await EmployeeDB.find({
			organization: this.org_id,
		});

		return employees.map((employee) => new EmployeeService(employee));
	}

	async updateDetails(opts: Partial<OrganizationData>) {
		const update: any = filterUndefinedKeys(opts);

		await OrganizationDB.updateOne(
			{
				_id: this._o_id,
			},
			update
		);

		this._org.name = update.name ?? this._org.name;
		this._org.industry = update.industry ?? this._org.industry;
		this._org.domain = update.domain ?? this._org.domain;
		this._org.logo = update.logo ?? this._org.logo;
		this._org.address = update.address ?? this._org.address;
		this._org.timezone = update.timezone ?? this._org.timezone;

		return this.organizationDetails;
	}

	async addEmployee(data: {
		account_id: IDType;
		parent?: IDType;
		can_create_others?: boolean;
		can_let_others_create?: boolean;
	}): Promise<EmployeeService> {
		const employee = await EmployeeService.createEmployee(this._o_id, data);
		return employee;
	}
}
