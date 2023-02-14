import { Language, AdminRole, AdminStatus } from "../utilities/enums/userEnum";

export interface AdminDatabaseInterface {
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

export interface AdminNew {
    firstName: string;
    lastName: string;
    language: Language;
    emailAddress: string;
}
