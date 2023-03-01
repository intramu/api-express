import { Language, AdminRole, AdminStatus } from "../utilities/enums/userEnum";

export interface IAdminDatabase {
    auth_id: string;
    first_name: string;
    last_name: string;
    language: Language;
    email_address: string;
    role: AdminRole;
    date_created: Date;
    status: AdminStatus;
    organization_id: string;
}

export interface IAdmin {
    authId: string;
    firstName: string;
    lastName: string;
    language: Language;
    emailAddress: string;
}

export interface IAdminNewService extends IAdmin {
    role: AdminRole;
    status: AdminStatus;
    organizationId: string;
}

export interface IAdminNew {
    authId: string;
    firstName: string;
    lastName: string;
    language: Language;
    emailAddress: string;
    role: AdminRole;
    status: AdminStatus;
    dateCreated: Date;
}
