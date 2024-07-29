import { AccountDB, EmployeeDB, IOrganization, OrganizationDB } from '@/db';
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

	static async listOrganizations() {
		const organizations = await OrganizationDB.aggregate([
			{
				$lookup: {
					from: EmployeeDB.collection.name,
					localField: '_id',
					foreignField: 'organization',
					as: 'employees',
				},
			},
			{
				$lookup: {
					from: AccountDB.collection.name,
					localField: 'owner',
					foreignField: '_id',
					as: 'owner_details',
				},
			},
			{
				$addFields: {
					total_employees: {
						$size: '$employees',
					},
				},
			},
			{
				$addFields: {
					owner_details: {
						$first: '$owner_details',
					},
				},
			},
			{
				$addFields: {
					owner_id: '$owner_details._id',
					owner_name: '$owner_details.name',
					owner_phone: '$owner_details.phone',
					owner_email: '$owner_details.email',
				},
			},
		]);

		return organizations.map((org) => ({
			...new OrganizationService(org).organizationDetails,
			total_employees: org.total_employees,
			owner: {
				id: org.owner_id,
				name: org.owner_name,
				phone: org.owner_phone,
				email: org.owner_email,
			},
		}));
	}

	get org_id() {
		return this._o_id;
	}

	get owner_id() {
		return this._org.owner;
	}

	get organizationDetails() {
		return {
			id: this._o_id,
			name: this._org.name,
			industry: this._org.industry,
			domain: this._org.domain,
			logo: this._org.logo,
			address: this._org.address,
			timezone: this._org.timezone,
			categories: this._org.categories,
			owner: this._org.owner,
		};
	}

	async getEmployees(): Promise<EmployeeService[]> {
		const employees = await EmployeeDB.find({
			organization: this.org_id,
		});

		return employees.map((employee) => new EmployeeService(employee));
	}

	async getOrganizationTree() {
		const employees = await EmployeeDB.find({
			organization: this.org_id,
		});

		const services = employees.map((employee) => new EmployeeService(employee));
		const details = await Promise.all(services.map((emp) => emp.getDetails()));

		const idMap = new Map();
		const root: {
			name: string;
			attributes: any;
			children: any[];
		}[] = [];

		details.forEach((item) => {
			const { employee_id } = item;
			idMap.set(employee_id.toString(), {
				name: item.name,
				attributes: {
					Email: item.email,
					Phone: item.phone,
					'Can add other employees': item.can_create_others ? 'Yes' : 'No',
					'Can let others add employees': item.can_let_others_create ? 'Yes' : 'No',
				},
				children: [],
			});
		});

		const noParentEmployees = [] as typeof root;

		details.forEach((item) => {
			const { employee_id, parent_id } = item;
			const node = idMap.get(employee_id.toString());
			if (parent_id) {
				if (idMap.has(parent_id.toString())) {
					idMap.get(parent_id.toString()).children.push(node);
				} else {
					noParentEmployees.push(node);
				}
			} else {
				root.push(node);
			}
		});

		noParentEmployees.forEach((node) => {
			root[0].children.push(node);
		});

		return {
			name: root[0].name,
			attributes: root[0].attributes,
			children: root[0].children,
		};
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

	async updateCategories(categories: string[]) {
		await OrganizationDB.updateOne(
			{
				_id: this._o_id,
			},
			{
				categories,
			}
		);
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

	static async deleteOrganizationByOwnerID(org_id: IDType, owner_id: IDType) {
		const result = await OrganizationDB.deleteOne({
			_id: org_id,
			owner: owner_id,
		});
		if (result.deletedCount > 0) {
			await EmployeeDB.deleteMany({
				organization: org_id,
			});
		}
	}
}
