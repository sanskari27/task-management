export type TOrganization={
    id: string;
    name: string;
    industry: string;
    domain: string;
    logo: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        _id: string;
    };
    timezone: string;
    categories: string[];
    owner: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    total_employees: number;
}